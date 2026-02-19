import { generateText } from "ai";
import { createAzure } from "@ai-sdk/azure";

export const maxDuration = 30;

const azure = createAzure({
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT!}/openai`,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  useDeploymentBasedUrls: true,
});

const EXTRACTION_PROMPT = `You are a memory extraction assistant. Analyze the conversation and identify new facts about the user that would be useful to remember for future conversations.

Rules:
- Only extract facts about the USER (not the assistant)
- Facts should be concise, single-sentence statements
- Avoid duplicating any existing memories listed below
- Focus on preferences, personal details, work/projects, goals, and habits
- Return a JSON array of strings, e.g. ["fact 1", "fact 2"]
- If no new facts are found, return an empty array []
- Do NOT wrap the JSON in markdown code blocks

Existing memories:
{existingMemories}

Return ONLY the JSON array, nothing else.`;

export async function POST(req: Request) {
  const { messages, existingMemories } = await req.json();

  const recentMessages = messages.slice(-10);

  const conversationText = recentMessages
    .map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => {
      const text = m.content || m.parts?.find((p: { type: string; text?: string }) => p.type === "text")?.text || "";
      return `${m.role}: ${text}`;
    })
    .join("\n");

  const memoriesList = existingMemories.length > 0
    ? existingMemories.map((m: string) => `- ${m}`).join("\n")
    : "(none)";

  const prompt = EXTRACTION_PROMPT.replace("{existingMemories}", memoriesList);

  const { text } = await generateText({
    model: azure.chat(process.env.AZURE_OPENAI_DEPLOYMENT!),
    system: prompt,
    messages: [{ role: "user", content: conversationText }],
  });

  let facts: string[];
  try {
    facts = JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      facts = JSON.parse(match[0]);
    } else {
      facts = [];
    }
  }

  if (!Array.isArray(facts)) {
    facts = [];
  }

  return Response.json({ facts });
}
