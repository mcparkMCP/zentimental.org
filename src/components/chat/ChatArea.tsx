"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";
import { ScrollAnchor } from "./ScrollAnchor";
import { Memory } from "@/types/memory";
import { Persona } from "@/types/persona";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { getMessages, saveMessages } from "@/lib/conversation-store";
import type { UIMessage } from "ai";
import type { KBSearchResult } from "@/types/knowledge-base";

interface ChatAreaProps {
  conversationId: string;
  memories: Memory[];
  persona: Persona;
  onFirstMessage: (title: string) => void;
}

async function searchKnowledgeBase(query: string): Promise<string | null> {
  try {
    const res = await fetch("/api/knowledge-base/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results: KBSearchResult[] = data.results ?? [];
    if (results.length === 0) return null;

    return results
      .map((r) => `[Source: ${r.documentFilename}]\n${r.chunk.content}`)
      .join("\n\n---\n\n");
  } catch {
    return null;
  }
}

export function ChatArea({ conversationId, memories, persona, onFirstMessage }: ChatAreaProps) {
  const hasSetTitle = useRef(false);
  const [input, setInput] = useState("");
  const systemPrompt = buildSystemPrompt(memories, persona);
  const kbContextRef = useRef<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ systemPrompt, kbContext: kbContextRef.current }),
      }),
    [systemPrompt]
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    setMessages,
  } = useChat({
    id: conversationId,
    transport,
    messages: getMessages(conversationId),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(conversationId, messages as UIMessage[]);
    }
  }, [messages, conversationId]);

  // Auto-title from first user message
  useEffect(() => {
    if (!hasSetTitle.current && messages.length >= 1) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (firstUserMsg) {
        const textPart = firstUserMsg.parts?.find(
          (p): p is Extract<typeof p, { type: "text" }> => p.type === "text"
        );
        if (textPart) {
          hasSetTitle.current = true;
          const title =
            textPart.text.length > 50
              ? textPart.text.slice(0, 47) + "..."
              : textPart.text;
          onFirstMessage(title);
        }
      }
    }
  }, [messages, onFirstMessage]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (!input.trim() || isLoading) return;
      const text = input;
      setInput("");

      // Search knowledge base for relevant context before sending
      const kbContext = await searchKnowledgeBase(text);
      kbContextRef.current = kbContext;

      sendMessage({ text });
    },
    [input, isLoading, sendMessage]
  );

  const handleSuggestion = useCallback(
    async (text: string) => {
      const kbContext = await searchKnowledgeBase(text);
      kbContextRef.current = kbContext;
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleEdit = useCallback(
    (messageId: string, newText: string) => {
      if (isLoading) return;
      // Find the message index and truncate everything after it
      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx === -1) return;

      const truncated = messages.slice(0, idx);
      setMessages(truncated as UIMessage[]);

      // Send the edited message as new
      setTimeout(async () => {
        const kbContext = await searchKnowledgeBase(newText);
        kbContextRef.current = kbContext;
        sendMessage({ text: newText });
      }, 50);
    },
    [messages, isLoading, setMessages, sendMessage]
  );

  const handleRegenerate = useCallback(
    (messageId: string) => {
      if (isLoading) return;
      // Find the assistant message and remove it, then regenerate
      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx === -1) return;

      const truncated = messages.slice(0, idx);
      setMessages(truncated as UIMessage[]);

      setTimeout(() => {
        regenerate();
      }, 50);
    },
    [messages, isLoading, setMessages, regenerate]
  );

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <EmptyState onSuggestion={handleSuggestion} />
      ) : (
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message as UIMessage}
                onEdit={handleEdit}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 py-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-accent,#10a37f)] flex items-center justify-center">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm my-2">
                <span>Something went wrong.</span>
                <button
                  onClick={() => regenerate()}
                  className="underline hover:text-red-300"
                >
                  Try again
                </button>
              </div>
            )}
            <ScrollAnchor trackVisibility />
          </div>
        </div>
      )}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
