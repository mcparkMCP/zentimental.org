import { Memory } from "@/types/memory";
import { Persona } from "@/types/persona";

const BASE_PROMPT = `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4o architecture.
You are helpful, creative, clever, and very friendly. You answer questions accurately and concisely.
When writing code, use markdown code blocks with the appropriate language tag.
Current date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`;

export function buildSystemPrompt(memories: Memory[], persona?: Persona): string {
  let prompt = BASE_PROMPT;

  // Add persona system prompt if one is active and not the default
  if (persona && persona.id !== "default" && persona.systemPrompt) {
    prompt += `\n\n${persona.systemPrompt}`;
  }

  if (memories.length === 0) return prompt;

  const memoryBlock = memories.map((m) => `- ${m.content}`).join("\n");

  return `${prompt}

You have the following memories about the user. Use them to personalize your responses when relevant, but don't mention that you have "memories" explicitly unless asked:

${memoryBlock}`;
}
