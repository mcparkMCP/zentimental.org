import { streamText, type UIMessage, type ModelMessage } from "ai";
import { createAzure } from "@ai-sdk/azure";

export const maxDuration = 60;

const azure = createAzure({
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT!}/openai`,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  useDeploymentBasedUrls: true,
});

function convertToModelMessages(uiMessages: UIMessage[]): ModelMessage[] {
  return uiMessages.map((msg) => {
    const textParts = msg.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

    return {
      role: msg.role as "user" | "assistant",
      content: textParts,
    };
  });
}

export async function POST(req: Request) {
  const { messages, systemPrompt } = await req.json();

  const result = streamText({
    model: azure.chat(process.env.AZURE_OPENAI_DEPLOYMENT!),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
