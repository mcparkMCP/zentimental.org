"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Memory } from "@/types/memory";
import type { UIMessage } from "ai";

const MEMORY_EXTRACTION_COOLDOWN = 3;

interface Suggestion {
  id: string;
  content: string;
}

interface UseMemoryExtractionOptions {
  messages: UIMessage[];
  memories: Memory[];
  status: string;
  onAccept: (memories: Memory[]) => void;
}

export function useMemoryExtraction({
  messages,
  memories,
  status,
  onAccept,
}: UseMemoryExtractionOptions) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const prevStatusRef = useRef(status);
  const assistantTurnCount = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prevStatus === "streaming" && status === "ready") {
      assistantTurnCount.current += 1;

      if (assistantTurnCount.current % MEMORY_EXTRACTION_COOLDOWN !== 0) {
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsExtracting(true);

      const existingMemories = memories.map((m) => m.content);

      fetch("/api/extract-memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, existingMemories }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: { facts: string[] }) => {
          if (data.facts && data.facts.length > 0) {
            const newSuggestions: Suggestion[] = data.facts.map((fact) => ({
              id: crypto.randomUUID(),
              content: fact,
            }));
            setSuggestions((prev) => [...prev, ...newSuggestions]);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Memory extraction failed:", err);
          }
        })
        .finally(() => {
          setIsExtracting(false);
        });
    }
  }, [status, messages, memories]);

  const acceptSuggestion = useCallback(
    (id: string) => {
      const suggestion = suggestions.find((s) => s.id === id);
      if (!suggestion) return;

      const memory: Memory = {
        id: crypto.randomUUID(),
        content: suggestion.content,
        createdAt: Date.now(),
      };
      onAccept([memory]);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    },
    [suggestions, onAccept]
  );

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setSuggestions([]);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    suggestions,
    isExtracting,
    acceptSuggestion,
    dismissSuggestion,
    dismissAll,
  };
}
