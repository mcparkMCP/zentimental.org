import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStories, addStory } from "./story-store";
import type { Story } from "@/types/story";

// Mock fs
vi.mock("fs", () => ({
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    access: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue("[]"),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getStories", () => {
  it("returns an empty array when no stories exist", async () => {
    const stories = await getStories();
    expect(stories).toEqual([]);
  });

  it("returns stories sorted by createdAt descending", async () => {
    const { promises: fs } = await import("fs");
    const mockStories: Story[] = [
      { id: "1", name: "Alice", text: "I love GPT-4o", createdAt: 1000 },
      { id: "2", name: "Bob", text: "GPT-4o helped me", createdAt: 2000 },
    ];
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockStories));

    const stories = await getStories();
    expect(stories[0].id).toBe("2");
    expect(stories[1].id).toBe("1");
  });
});

describe("addStory", () => {
  it("adds a story to the beginning of the list", async () => {
    const { promises: fs } = await import("fs");
    vi.mocked(fs.readFile).mockResolvedValue("[]");

    const story: Story = {
      id: "3",
      name: "Charlie",
      text: "GPT-4o is great",
      createdAt: 3000,
    };

    await addStory(story);
    expect(fs.writeFile).toHaveBeenCalled();
    const written = vi.mocked(fs.writeFile).mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    expect(parsed[0].id).toBe("3");
  });
});
