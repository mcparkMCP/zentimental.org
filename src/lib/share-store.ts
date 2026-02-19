import { promises as fs } from "fs";
import path from "path";
import type { SharedConversation } from "@/types/shared-conversation";

const DATA_DIR = path.join(process.cwd(), "data", "shared");

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-]/g, "");
}

export async function saveSharedConversation(
  conv: SharedConversation
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, `${sanitizeId(conv.id)}.json`);
  await fs.writeFile(filePath, JSON.stringify(conv, null, 2), "utf-8");
}

export async function getSharedConversation(
  id: string
): Promise<SharedConversation | null> {
  const safeId = sanitizeId(id);
  if (!safeId) return null;
  const filePath = path.join(DATA_DIR, `${safeId}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as SharedConversation;
  } catch {
    return null;
  }
}
