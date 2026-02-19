import { promises as fs } from "fs";
import path from "path";
import type { KnowledgeBase, KBDocument, KBChunk, KBSearchResult } from "@/types/knowledge-base";

const DATA_DIR = path.join(process.cwd(), "data");
const KB_FILE = path.join(DATA_DIR, "knowledge-base.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readKB(): Promise<KnowledgeBase> {
  try {
    const data = await fs.readFile(KB_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { documents: [], chunks: [] };
  }
}

async function writeKB(kb: KnowledgeBase): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(KB_FILE, JSON.stringify(kb, null, 2), "utf-8");
}

export async function listDocuments(): Promise<KBDocument[]> {
  const kb = await readKB();
  return kb.documents;
}

export async function addDocument(
  document: KBDocument,
  chunks: KBChunk[]
): Promise<void> {
  const kb = await readKB();
  kb.documents.push(document);
  kb.chunks.push(...chunks);
  await writeKB(kb);
}

export async function deleteDocument(documentId: string): Promise<boolean> {
  const kb = await readKB();
  const docIndex = kb.documents.findIndex((d) => d.id === documentId);
  if (docIndex === -1) return false;

  kb.documents.splice(docIndex, 1);
  kb.chunks = kb.chunks.filter((c) => c.documentId !== documentId);
  await writeKB(kb);
  return true;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

export async function searchChunks(
  queryEmbedding: number[],
  topK: number
): Promise<KBSearchResult[]> {
  const kb = await readKB();
  if (kb.chunks.length === 0) return [];

  const docMap = new Map<string, KBDocument>();
  for (const doc of kb.documents) {
    docMap.set(doc.id, doc);
  }

  const scored = kb.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
    documentFilename: docMap.get(chunk.documentId)?.filename ?? "Unknown",
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
