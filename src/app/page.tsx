"use client";

import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { MemoryManager } from "@/components/memory/MemoryManager";
import { useConversations } from "@/hooks/useConversations";
import { useMemories } from "@/hooks/useMemories";

export default function Home() {
  const {
    conversations,
    activeId,
    newConversation,
    deleteConversation,
    renameConversation,
    selectConversation,
  } = useConversations();

  const { memories, addMemories, deleteMemory, updateMemory, clearMemories } =
    useMemories();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryManagerOpen, setMemoryManagerOpen] = useState(false);

  const handleNewChat = useCallback(() => {
    newConversation();
    setSidebarOpen(false);
  }, [newConversation]);

  const handleFirstMessage = useCallback(
    (title: string) => {
      if (activeId) {
        renameConversation(activeId, title);
      }
    },
    [activeId, renameConversation]
  );

  const ensureConversation = useCallback(() => {
    if (!activeId) {
      newConversation();
    }
  }, [activeId, newConversation]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelect={selectConversation}
        onDelete={deleteConversation}
        onOpenMemories={() => setMemoryManagerOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center p-3 border-b border-[#2f2f2f]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 text-sm font-medium text-white">GPT-4o</span>
        </div>

        {activeId ? (
          <ChatArea
            key={activeId}
            conversationId={activeId}
            memories={memories}
            onFirstMessage={handleFirstMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={ensureConversation}
              className="px-6 py-3 bg-[#10a37f] text-white rounded-xl hover:bg-[#0d8c6d] transition-colors text-sm font-medium"
            >
              Start a New Chat
            </button>
          </div>
        )}
      </main>

      <MemoryManager
        isOpen={memoryManagerOpen}
        onClose={() => setMemoryManagerOpen(false)}
        memories={memories}
        onAddMemories={addMemories}
        onDeleteMemory={deleteMemory}
        onUpdateMemory={updateMemory}
        onClearMemories={clearMemories}
      />
    </div>
  );
}
