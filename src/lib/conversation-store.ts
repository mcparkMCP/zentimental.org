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
