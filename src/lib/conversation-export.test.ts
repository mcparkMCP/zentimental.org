import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  togglePinConversation,
  searchConversations,
  exportConversation,
  exportConversationAsMarkdown,
  exportAllConversations,
} from "./conversation-store";
import { CONVERSATIONS_KEY, MESSAGES_KEY_PREFIX } from "./constants";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
};

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];
  vi.clearAllMocks();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", localStorageMock);
});

describe("togglePinConversation", () => {
  it("pins an unpinned conversation", () => {
    const convs = [{ id: "1", title: "Test", createdAt: 1000, updatedAt: 1000 }];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    const result = togglePinConversation("1");
    expect(result).toBe(true);
    const saved = JSON.parse(store[CONVERSATIONS_KEY]);
    expect(saved[0].pinned).toBe(true);
  });

  it("unpins a pinned conversation", () => {
    const convs = [{ id: "1", title: "Test", createdAt: 1000, updatedAt: 1000, pinned: true }];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    const result = togglePinConversation("1");
    expect(result).toBe(false);
  });

  it("returns false for non-existent conversation", () => {
    store[CONVERSATIONS_KEY] = JSON.stringify([]);
    const result = togglePinConversation("nonexistent");
    expect(result).toBe(false);
  });
});

describe("searchConversations", () => {
  it("returns empty for empty query", () => {
    expect(searchConversations("")).toEqual([]);
    expect(searchConversations("  ")).toEqual([]);
  });

  it("finds conversations by title", () => {
    const convs = [
      { id: "1", title: "Python help", createdAt: 1000, updatedAt: 1000 },
      { id: "2", title: "JavaScript", createdAt: 2000, updatedAt: 2000 },
    ];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    const results = searchConversations("python");
    expect(results).toHaveLength(1);
    expect(results[0].conversation.id).toBe("1");
  });

  it("finds conversations by message content", () => {
    const convs = [{ id: "1", title: "Chat", createdAt: 1000, updatedAt: 1000 }];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    store[MESSAGES_KEY_PREFIX + "1"] = JSON.stringify([
      { id: "m1", role: "user", parts: [{ type: "text", text: "How do I use React hooks?" }] },
    ]);
    const results = searchConversations("hooks");
    expect(results).toHaveLength(1);
  });
});

describe("exportConversation", () => {
  it("returns null for non-existent conversation", () => {
    store[CONVERSATIONS_KEY] = JSON.stringify([]);
    expect(exportConversation("nonexistent")).toBeNull();
  });

  it("exports conversation data correctly", () => {
    const convs = [{ id: "1", title: "Test Chat", createdAt: 1000, updatedAt: 1000 }];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    store[MESSAGES_KEY_PREFIX + "1"] = JSON.stringify([
      { id: "m1", role: "user", parts: [{ type: "text", text: "Hello" }] },
      { id: "m2", role: "assistant", parts: [{ type: "text", text: "Hi there!" }] },
    ]);
    const result = exportConversation("1");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Test Chat");
    expect(result!.messages).toHaveLength(2);
    expect(result!.messages[0].role).toBe("user");
    expect(result!.messages[0].text).toBe("Hello");
  });
});

describe("exportConversationAsMarkdown", () => {
  it("returns null for non-existent conversation", () => {
    store[CONVERSATIONS_KEY] = JSON.stringify([]);
    expect(exportConversationAsMarkdown("nonexistent")).toBeNull();
  });

  it("exports as markdown format", () => {
    const convs = [{ id: "1", title: "Test Chat", createdAt: 1000, updatedAt: 1000 }];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    store[MESSAGES_KEY_PREFIX + "1"] = JSON.stringify([
      { id: "m1", role: "user", parts: [{ type: "text", text: "Hello" }] },
    ]);
    const md = exportConversationAsMarkdown("1");
    expect(md).not.toBeNull();
    expect(md).toContain("# Test Chat");
    expect(md).toContain("**You**");
    expect(md).toContain("Hello");
  });
});

describe("exportAllConversations", () => {
  it("exports all conversations", () => {
    const convs = [
      { id: "1", title: "Chat 1", createdAt: 1000, updatedAt: 1000 },
      { id: "2", title: "Chat 2", createdAt: 2000, updatedAt: 2000 },
    ];
    store[CONVERSATIONS_KEY] = JSON.stringify(convs);
    store[MESSAGES_KEY_PREFIX + "1"] = JSON.stringify([]);
    store[MESSAGES_KEY_PREFIX + "2"] = JSON.stringify([]);
    const results = exportAllConversations();
    expect(results).toHaveLength(2);
  });
});
