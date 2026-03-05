"use client";

import { SidebarHeader } from "./SidebarHeader";
import { ConversationItem } from "./ConversationItem";
import { ConversationSearch } from "./ConversationSearch";
import { Conversation } from "@/types/conversation";
import {
  Brain,
  Database,
  Github,
  X,
  Palette,
  Users,
  Heart,
  Clock,
  Globe,
  GitCompare,
  Download,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onOpenMemories: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenPersonas: () => void;
  onOpenTheme: () => void;
  onOpenExport: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  onPin,
  onOpenMemories,
  onOpenKnowledgeBase,
  onOpenPersonas,
  onOpenTheme,
  onOpenExport,
  isOpen,
  onClose,
}: SidebarProps) {
  const pinned = conversations.filter((c) => c.pinned);
  const unpinned = conversations.filter((c) => !c.pinned);

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
        className={`fixed md:relative z-50 h-full w-64 bg-[var(--theme-sidebar,#171717)] flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="md:hidden flex justify-end p-2">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <SidebarHeader onNewChat={onNewChat} />

        <div className="px-2 pt-2">
          <ConversationSearch
            onSelectConversation={(id) => {
              onSelect(id);
              onClose();
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {pinned.length > 0 && (
            <>
              <p className="text-xs text-gray-600 uppercase tracking-wider px-3 pt-2 pb-1">
                Pinned
              </p>
              {pinned.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onSelect={() => {
                    onSelect(conv.id);
                    onClose();
                  }}
                  onDelete={() => onDelete(conv.id)}
                  onPin={() => onPin(conv.id)}
                />
              ))}
              {unpinned.length > 0 && (
                <p className="text-xs text-gray-600 uppercase tracking-wider px-3 pt-3 pb-1">
                  Recent
                </p>
              )}
            </>
          )}
          {unpinned.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={() => {
                onSelect(conv.id);
                onClose();
              }}
              onDelete={() => onDelete(conv.id)}
              onPin={() => onPin(conv.id)}
            />
          ))}
          {conversations.length === 0 && (
            <p className="text-gray-600 text-xs text-center mt-8">
              No conversations yet
            </p>
          )}
        </div>
        <div className="p-3 border-t border-[var(--theme-border,#2f2f2f)] space-y-1 max-h-[45vh] overflow-y-auto">
          <button
            onClick={onOpenMemories}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Brain size={16} />
            Memory Manager
          </button>
          <button
            onClick={onOpenKnowledgeBase}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Database size={16} />
            Knowledge Base
          </button>
          <button
            onClick={onOpenPersonas}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Users size={16} />
            Personas
          </button>
          <button
            onClick={onOpenTheme}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Palette size={16} />
            Theme
          </button>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <div className="border-t border-[var(--theme-border,#2f2f2f)] my-1" />
          <Link
            href="/stories"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Heart size={16} />
            Story Wall
          </Link>
          <Link
            href="/timeline"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Clock size={16} />
            Timeline
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <GitCompare size={16} />
            Compare
          </Link>
          <Link
            href="/community"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Globe size={16} />
            Community
          </Link>
          <a
            href="https://github.com/chaollapark/zentimental.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[var(--theme-input,#2f2f2f)] hover:text-white transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </aside>
    </>
  );
}
