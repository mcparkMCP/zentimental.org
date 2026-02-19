"use client";

import { useState, useCallback, useEffect } from "react";
import { Memory } from "@/types/memory";
import { MEMORIES_KEY, MAX_MEMORIES } from "@/lib/constants";

function loadMemories(): Memory[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MEMORIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function persistMemories(memories: Memory[]) {
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const addMemories = useCallback((newMemories: Memory[]) => {
    setMemories((prev) => {
      const combined = [...prev, ...newMemories].slice(0, MAX_MEMORIES);
      persistMemories(combined);
      return combined;
    });
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persistMemories(next);
      return next;
    });
  }, []);

  const updateMemory = useCallback((id: string, content: string) => {
    setMemories((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, content } : m));
      persistMemories(next);
      return next;
    });
  }, []);

  const clearMemories = useCallback(() => {
    setMemories([]);
    persistMemories([]);
  }, []);

  return { memories, addMemories, deleteMemory, updateMemory, clearMemories };
}
