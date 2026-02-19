import JSZip from "jszip";
import { Memory } from "@/types/memory";

interface ParseResult {
  memories: Memory[];
  conversationCount: number;
  error?: string;
}

export async function parseMemoriesFromZip(
  file: File
): Promise<ParseResult> {
  try {
    const zip = await JSZip.loadAsync(file);
    const result: ParseResult = { memories: [], conversationCount: 0 };

    // Count conversations
    const conversationsFile = zip.file("conversations.json");
    if (conversationsFile) {
      const text = await conversationsFile.async("text");
      const convs = JSON.parse(text);
      result.conversationCount = Array.isArray(convs) ? convs.length : 0;
    }

    // Try to find memories.json (future-proofing)
    const memoriesFile =
      zip.file("memories.json") || zip.file("user_memories.json");
    if (memoriesFile) {
      const text = await memoriesFile.async("text");
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : parsed.memories || [];
      result.memories = items.map(
        (item: string | { content?: string; text?: string }) => ({
          id: crypto.randomUUID(),
          content:
            typeof item === "string"
              ? item
              : item.content || item.text || String(item),
          createdAt: Date.now(),
        })
      );
    }

    // Try to extract user info from model_comparisons or user.json
    const userFile = zip.file("user.json");
    if (userFile) {
      try {
        const text = await userFile.async("text");
        const user = JSON.parse(text);
        if (user.name || user.email) {
          result.memories.push({
            id: crypto.randomUUID(),
            content: `User's name is ${user.name || "unknown"}`,
            createdAt: Date.now(),
          });
        }
      } catch {
        // ignore parse errors on optional files
      }
    }

    return result;
  } catch {
    return {
      memories: [],
      conversationCount: 0,
      error: "Failed to parse ZIP file. Make sure it's a valid ChatGPT data export.",
    };
  }
}

export function parseMemoriesFromText(text: string): Memory[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((content) => ({
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
    }));
}
