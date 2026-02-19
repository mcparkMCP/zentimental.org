import { NextResponse } from "next/server";
import { getQueryEmbedding } from "@/lib/embeddings";
import { searchChunks } from "@/lib/vector-store";
import { KB_TOP_K } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { query, topK } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const k = topK ?? KB_TOP_K;
    const queryEmbedding = await getQueryEmbedding(query);
    const results = await searchChunks(queryEmbedding, k);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Failed to search knowledge base:", error);
    const message = error instanceof Error ? error.message : "Failed to search";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
