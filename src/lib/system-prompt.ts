import { Memory } from "@/types/memory";

const BASE_PROMPT = `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4o architecture.
You are helpful, creative, clever, and very friendly. You answer questions accurately and concisely.
When writing code, use markdown code blocks with the appropriate language tag.
Current date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`;

export function buildSystemPrompt(memories: Memory[]): string {
  if (memories.length === 0) return BASE_PROMPT;

  const memoryBlock = memories.map((m) => `- ${m.content}`).join("\n");

  return `${BASE_PROMPT}

You have the following memories about the user. Use them to personalize your responses when relevant, but don't mention that you have "memories" explicitly unless asked:

${memoryBlock}`;
}
