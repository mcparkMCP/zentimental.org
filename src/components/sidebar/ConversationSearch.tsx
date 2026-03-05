"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { searchConversations } from "@/lib/conversation-store";

interface ConversationSearchProps {
  onSelectConversation: (id: string) => void;
}

export function ConversationSearch({ onSelectConversation }: ConversationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchConversations>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(searchConversations(value));
    } else {
      setResults([]);
    }
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onSelectConversation(id);
      setIsOpen(false);
      setQuery("");
      setResults([]);
    },
    [onSelectConversation]
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
      >
        <Search size={14} />
        <span>Search chats...</span>
      </button>
    );
  }

  return (
    <div className="px-2 pb-2 space-y-1">
      <div className="flex items-center gap-2 bg-[var(--theme-input,#2f2f2f)] rounded-lg px-2 py-1.5">
        <Search size={14} className="text-gray-500 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search conversations..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery("");
            setResults([]);
          }}
          className="text-gray-500 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
      {results.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {results.map(({ conversation, matchingMessages }) => (
            <button
              key={conversation.id}
              onClick={() => handleSelect(conversation.id)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--theme-input,#2f2f2f)] transition-colors"
            >
              <span className="text-sm text-white block truncate">
                {conversation.title}
              </span>
              {matchingMessages[0] && (
                <span className="text-xs text-gray-500 block truncate mt-0.5">
                  {matchingMessages[0]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-2">No results</p>
      )}
    </div>
  );
}
