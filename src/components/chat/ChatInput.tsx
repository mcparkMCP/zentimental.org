"use client";

import { useRef, useCallback } from "react";
import { ArrowUp, Mic } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [input, isLoading, onSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Auto-resize
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
      }
    },
    [setInput]
  );

  return (
    <div className="border-t border-[#2f2f2f] bg-[#212121] p-4">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto relative">
        <div className="flex items-end gap-2 bg-[#2f2f2f] rounded-2xl px-4 py-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message GPT-4o..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-500 text-sm max-h-[200px]"
          />
          <button
            type="button"
            disabled
            className="p-2 text-gray-600 cursor-not-allowed"
            title="Voice input coming soon"
          >
            <Mic size={18} />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>
      <p className="text-center text-xs text-gray-500 mt-2">
        GPT-4o can make mistakes. Check important info.
      </p>
    </div>
  );
}
