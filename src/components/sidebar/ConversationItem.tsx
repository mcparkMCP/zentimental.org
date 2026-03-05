"use client";

import { useState } from "react";
import { Trash2, MessageSquare, Pin } from "lucide-react";
import { Conversation } from "@/types/conversation";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onPin: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onPin,
}: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
        isActive ? "bg-[var(--theme-input,#2f2f2f)] text-white" : "text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)]/50 hover:text-gray-200"
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <MessageSquare size={16} className="flex-shrink-0 opacity-50" />
      <span className="flex-1 truncate">{conversation.title}</span>
      {conversation.pinned && !showActions && (
        <Pin size={12} className="text-[var(--theme-accent,#10a37f)] flex-shrink-0" />
      )}
      {showActions && (
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className={`p-1 rounded transition-colors ${
              conversation.pinned
                ? "text-[var(--theme-accent,#10a37f)] hover:text-white"
                : "text-gray-500 hover:text-[var(--theme-accent,#10a37f)]"
            }`}
            title={conversation.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
