"use client";

import { SidebarHeader } from "./SidebarHeader";
import { ConversationItem } from "./ConversationItem";
import { Conversation } from "@/types/conversation";
import { Brain, Github, X } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenMemories: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  onOpenMemories,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:relative z-50 h-full w-64 bg-[#171717] flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="md:hidden flex justify-end p-2">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <SidebarHeader onNewChat={onNewChat} />
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={() => {
                onSelect(conv.id);
                onClose();
              }}
              onDelete={() => onDelete(conv.id)}
            />
          ))}
          {conversations.length === 0 && (
            <p className="text-gray-600 text-xs text-center mt-8">
              No conversations yet
            </p>
          )}
        </div>
        <div className="p-3 border-t border-[#2f2f2f] space-y-1">
          <button
            onClick={onOpenMemories}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#2f2f2f] hover:text-white transition-colors"
          >
            <Brain size={16} />
            Memory Manager
          </button>
          <a
            href="https://github.com/chaollapark/zentimental.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#2f2f2f] hover:text-white transition-colors"
          >
            <Github size={16} />
            Contribute on GitHub
          </a>
        </div>
      </aside>
    </>
  );
}
