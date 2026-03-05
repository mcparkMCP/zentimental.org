import { promises as fs } from "fs";
import path from "path";
import type { Story } from "@/types/story";

const DATA_FILE = path.join(process.cwd(), "data", "stories.json");

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getStories(): Promise<Story[]> {
  await ensureFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  const stories: Story[] = JSON.parse(data);
  return stories.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addStory(story: Story): Promise<void> {
  const stories = await getStories();
  stories.unshift(story);
  await fs.writeFile(DATA_FILE, JSON.stringify(stories, null, 2), "utf-8");
}
