import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "./system-prompt";
import type { Memory } from "@/types/memory";
import type { Persona } from "@/types/persona";

describe("buildSystemPrompt with personas", () => {
  const defaultPersona: Persona = {
    id: "default",
    name: "GPT-4o",
    description: "Default",
    systemPrompt: "",
    icon: "bot",
    createdAt: 0,
  };

  const codeBuddyPersona: Persona = {
    id: "code-buddy",
    name: "Code Buddy",
    description: "Expert programmer",
    systemPrompt: "You are an expert programming assistant.",
    icon: "code",
    createdAt: 1,
  };

  it("does not add persona prompt for default persona", () => {
    const prompt = buildSystemPrompt([], defaultPersona);
    expect(prompt).not.toContain("expert programming");
  });

  it("adds persona system prompt for non-default persona", () => {
    const prompt = buildSystemPrompt([], codeBuddyPersona);
    expect(prompt).toContain("expert programming assistant");
  });

  it("includes both persona and memories", () => {
    const memories: Memory[] = [
      { id: "1", content: "User likes TypeScript", createdAt: Date.now() },
    ];
    const prompt = buildSystemPrompt(memories, codeBuddyPersona);
    expect(prompt).toContain("expert programming assistant");
    expect(prompt).toContain("User likes TypeScript");
  });

  it("works without persona parameter", () => {
    const prompt = buildSystemPrompt([]);
    expect(prompt).toContain("You are ChatGPT");
  });
});
