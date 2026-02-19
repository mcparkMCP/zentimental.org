import { KB_CHUNK_SIZE, KB_CHUNK_OVERLAP } from "./constants";

export function chunkText(
  text: string,
  chunkSize: number = KB_CHUNK_SIZE,
  overlap: number = KB_CHUNK_OVERLAP
): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  if (cleaned.length <= chunkSize) return [cleaned];

  const paragraphs = cleaned.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if (currentChunk && (currentChunk.length + trimmed.length + 2) > chunkSize) {
      chunks.push(currentChunk.trim());
      const overlapText = currentChunk.slice(-overlap);
      currentChunk = overlapText + "\n\n" + trimmed;
    } else {
      currentChunk = currentChunk ? currentChunk + "\n\n" + trimmed : trimmed;
    }

    if (currentChunk.length > chunkSize * 1.5) {
      const subChunks = splitLongText(currentChunk, chunkSize, overlap);
      for (let i = 0; i < subChunks.length - 1; i++) {
        chunks.push(subChunks[i]);
      }
      currentChunk = subChunks[subChunks.length - 1];
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function splitLongText(text: string, chunkSize: number, overlap: number): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current && (current.length + sentence.length) > chunkSize) {
      chunks.push(current.trim());
      const overlapText = current.slice(-overlap);
      current = overlapText + sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
