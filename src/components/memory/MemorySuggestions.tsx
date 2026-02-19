"use client";

import { Brain, Check, X, Loader2 } from "lucide-react";

interface Suggestion {
  id: string;
  content: string;
}

interface MemorySuggestionsProps {
  suggestions: Suggestion[];
  isExtracting: boolean;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

const MAX_VISIBLE = 3;

export function MemorySuggestions({
  suggestions,
  isExtracting,
  onAccept,
  onDismiss,
  onDismissAll,
}: MemorySuggestionsProps) {
  if (!isExtracting && suggestions.length === 0) return null;

  const visible = suggestions.slice(0, MAX_VISIBLE);
  const remaining = suggestions.length - MAX_VISIBLE;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-2">
      <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Brain size={14} className="text-purple-400" />
            <span className="font-medium">Memory suggestions</span>
            {isExtracting && (
              <Loader2 size={12} className="animate-spin text-gray-400" />
            )}
          </div>
          {suggestions.length > 1 && (
            <button
              onClick={onDismissAll}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Dismiss all
            </button>
          )}
        </div>

        {visible.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-center gap-2 py-1.5 group"
          >
            <p className="flex-1 text-sm text-gray-300 truncate">
              {suggestion.content}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onAccept(suggestion.id)}
                className="p-1 text-gray-500 hover:text-green-400 transition-colors"
                title="Accept"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => onDismiss(suggestion.id)}
                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            +{remaining} more
          </p>
        )}
      </div>
    </div>
  );
}
