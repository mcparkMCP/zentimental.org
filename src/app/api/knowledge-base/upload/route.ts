import { NextResponse } from "next/server";
import { extractText } from "@/lib/file-parser-server";
import { chunkText } from "@/lib/text-chunker";
import { getEmbeddings } from "@/lib/embeddings";
import { addDocument, listDocuments } from "@/lib/vector-store";
import { KB_MAX_DOCUMENTS, KB_MAX_FILE_SIZE } from "@/lib/constants";
import type { KBDocument, KBChunk } from "@/types/knowledge-base";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > KB_MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${KB_MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const existing = await listDocuments();
    if (existing.length >= KB_MAX_DOCUMENTS) {
      return NextResponse.json(
        { error: `Maximum ${KB_MAX_DOCUMENTS} documents allowed. Delete some first.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractText(buffer, file.name);

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from this file" },
        { status: 400 }
      );
    }

    const chunkTexts = chunkText(text);
    const embeddings = await getEmbeddings(chunkTexts);

    const documentId = crypto.randomUUID();
    const document: KBDocument = {
      id: documentId,
      filename: file.name,
      fileType: file.type || "text/plain",
      fileSize: file.size,
      chunkCount: chunkTexts.length,
      uploadedAt: Date.now(),
    };

    const chunks: KBChunk[] = chunkTexts.map((content, index) => ({
      id: crypto.randomUUID(),
      documentId,
      content,
      index,
      embedding: embeddings[index],
    }));

    await addDocument(document, chunks);

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Failed to upload document:", error);
    const message = error instanceof Error ? error.message : "Failed to upload document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
