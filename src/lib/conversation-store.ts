import { Conversation } from "@/types/conversation";
import {
  CONVERSATIONS_KEY,
  MESSAGES_KEY_PREFIX,
  TITLE_MAX_LENGTH,
} from "./constants";
import { UIMessage } from "ai";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONVERSATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function createConversation(): Conversation {
  const conv: Conversation = {
    id: crypto.randomUUID(),
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const convs = getConversations();
  convs.unshift(conv);
  saveConversations(convs);
  return conv;
}

export function deleteConversation(id: string) {
  const convs = getConversations().filter((c) => c.id !== id);
  saveConversations(convs);
  localStorage.removeItem(MESSAGES_KEY_PREFIX + id);
}

export function updateConversationTitle(id: string, title: string) {
  const convs = getConversations();
  const conv = convs.find((c) => c.id === id);
  if (conv) {
    conv.title = title.slice(0, TITLE_MAX_LENGTH);
    conv.updatedAt = Date.now();
    saveConversations(convs);
  }
}

export function togglePinConversation(id: string): boolean {
  const convs = getConversations();
  const conv = convs.find((c) => c.id === id);
  if (!conv) return false;
  conv.pinned = !conv.pinned;
  conv.updatedAt = Date.now();
  saveConversations(convs);
  return conv.pinned;
}

export function getMessages(conversationId: string): UIMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MESSAGES_KEY_PREFIX + conversationId);
  return raw ? JSON.parse(raw) : [];
}

export function saveMessages(conversationId: string, messages: UIMessage[]) {
  localStorage.setItem(
    MESSAGES_KEY_PREFIX + conversationId,
    JSON.stringify(messages)
  );
}

export function searchConversations(query: string): { conversation: Conversation; matchingMessages: string[] }[] {
  if (!query.trim()) return [];
  const convs = getConversations();
  const lowerQuery = query.toLowerCase();
  const results: { conversation: Conversation; matchingMessages: string[] }[] = [];

  for (const conv of convs) {
    const matchingMessages: string[] = [];

    if (conv.title.toLowerCase().includes(lowerQuery)) {
      matchingMessages.push(`Title: ${conv.title}`);
    }

    const messages = getMessages(conv.id);
    for (const msg of messages) {
      const textParts = msg.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? "";
      if (textParts.toLowerCase().includes(lowerQuery)) {
        const idx = textParts.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, idx - 30);
        const end = Math.min(textParts.length, idx + query.length + 30);
        const snippet = (start > 0 ? "..." : "") + textParts.slice(start, end) + (end < textParts.length ? "..." : "");
        matchingMessages.push(snippet);
      }
    }

    if (matchingMessages.length > 0) {
      results.push({ conversation: conv, matchingMessages: matchingMessages.slice(0, 3) });
    }
  }

  return results;
}

export interface ExportedConversation {
  title: string;
  createdAt: string;
  messages: { role: string; text: string }[];
}

export function exportConversation(id: string): ExportedConversation | null {
  const convs = getConversations();
  const conv = convs.find((c) => c.id === id);
  if (!conv) return null;
  const messages = getMessages(id);
  return {
    title: conv.title,
    createdAt: new Date(conv.createdAt).toISOString(),
    messages: messages.map((m) => ({
      role: m.role,
      text: m.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? "",
    })),
  };
}

export function exportConversationAsMarkdown(id: string): string | null {
  const exported = exportConversation(id);
  if (!exported) return null;

  let md = `# ${exported.title}\n\n`;
  md += `*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

  for (const msg of exported.messages) {
    const label = msg.role === "user" ? "**You**" : "**GPT-4o**";
    md += `${label}:\n\n${msg.text}\n\n---\n\n`;
  }

  return md;
}

export function exportAllConversations(): ExportedConversation[] {
  const convs = getConversations();
  const results: ExportedConversation[] = [];
  for (const conv of convs) {
    const exported = exportConversation(conv.id);
    if (exported) results.push(exported);
  }
  return results;
}
