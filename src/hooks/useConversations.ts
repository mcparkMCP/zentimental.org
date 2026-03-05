"use client";

import { useState, useCallback, useEffect } from "react";
import { Conversation } from "@/types/conversation";
import {
  getConversations,
  createConversation,
  deleteConversation as deleteConv,
  updateConversationTitle,
  togglePinConversation,
} from "@/lib/conversation-store";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const convs = getConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setActiveId(convs[0].id);
    }
  }, []);

  const newConversation = useCallback(() => {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    return conv;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      deleteConv(id);
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId]
  );

  const renameConversation = useCallback((id: string, title: string) => {
    updateConversationTitle(id, title);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const pinConversation = useCallback((id: string) => {
    const pinned = togglePinConversation(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned } : c))
    );
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return {
    conversations,
    activeId,
    newConversation,
    deleteConversation,
    renameConversation,
    pinConversation,
    selectConversation,
  };
}
