"use client";

import { Bot } from "lucide-react";

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a Python script to scrape a website",
  "Help me plan a weekend trip to NYC",
  "What are the best practices for React?",
];

export function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full bg-[#10a37f] flex items-center justify-center mb-6">
        <Bot size={32} className="text-white" />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-8">
        How can I help you today?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestion(text)}
            className="text-left p-4 rounded-xl border border-[#2f2f2f] hover:bg-[#2f2f2f] transition-colors text-sm text-gray-300"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
