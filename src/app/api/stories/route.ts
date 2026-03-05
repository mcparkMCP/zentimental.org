import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStories, addStory } from "@/lib/story-store";
import { MAX_STORY_LENGTH, MAX_STORY_NAME_LENGTH } from "@/lib/constants";

export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, text } = body as { name?: string; text?: string };

    if (!name || !text || !name.trim() || !text.trim()) {
      return NextResponse.json(
        { error: "Name and story text are required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim().slice(0, MAX_STORY_NAME_LENGTH);
    const trimmedText = text.trim().slice(0, MAX_STORY_LENGTH);

    const story = {
      id: randomUUID(),
      name: trimmedName,
      text: trimmedText,
      createdAt: Date.now(),
    };

    await addStory(story);
    return NextResponse.json({ story });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit story" },
      { status: 500 }
    );
  }
}
