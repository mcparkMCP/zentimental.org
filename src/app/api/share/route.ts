import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveSharedConversation } from "@/lib/share-store";
import type { SharedMessage } from "@/types/shared-conversation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, messages } = body as {
      title?: string;
      messages?: SharedMessage[];
    };

    if (
      !title ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return NextResponse.json(
        { error: "title and messages are required" },
        { status: 400 }
      );
    }

    for (const msg of messages) {
      if (
        (msg.role !== "user" && msg.role !== "assistant") ||
        typeof msg.text !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid message format" },
          { status: 400 }
        );
      }
    }

    const id = randomUUID();
    await saveSharedConversation({
      id,
      title,
      sharedAt: Date.now(),
      messages,
    });

    return NextResponse.json({ id, url: `/share/${id}` });
  } catch {
    return NextResponse.json(
      { error: "Failed to share conversation" },
      { status: 500 }
    );
  }
}
