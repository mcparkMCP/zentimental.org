"use client";

import { useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { Conversation } from "@/types/conversation";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
        isActive ? "bg-[#2f2f2f] text-white" : "text-gray-400 hover:bg-[#2f2f2f]/50 hover:text-gray-200"
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <MessageSquare size={16} className="flex-shrink-0 opacity-50" />
      <span className="flex-1 truncate">{conversation.title}</span>
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-[#3f3f3f] text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
