"use client";

import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { MemoryManager } from "@/components/memory/MemoryManager";
import { KnowledgeBaseManager } from "@/components/knowledge-base/KnowledgeBaseManager";
import { PersonaManager } from "@/components/personas/PersonaManager";
import { ThemePicker } from "@/components/settings/ThemePicker";
import { ExportDialog } from "@/components/chat/ExportDialog";
import { useConversations } from "@/hooks/useConversations";
import { useMemories } from "@/hooks/useMemories";
import { usePersonas } from "@/hooks/usePersonas";
import { useTheme } from "@/hooks/useTheme";

export default function Home() {
  const {
    conversations,
    activeId,
    newConversation,
    deleteConversation,
    renameConversation,
    pinConversation,
    selectConversation,
  } = useConversations();

  const { memories, addMemories, deleteMemory, updateMemory, clearMemories } =
    useMemories();

  const { personas, activePersona, selectPersona, addPersona, deletePersona } =
    usePersonas();

  const { themeId, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryManagerOpen, setMemoryManagerOpen] = useState(false);
  const [kbManagerOpen, setKbManagerOpen] = useState(false);
  const [personaManagerOpen, setPersonaManagerOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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
        onPin={pinConversation}
        onOpenMemories={() => setMemoryManagerOpen(true)}
        onOpenKnowledgeBase={() => setKbManagerOpen(true)}
        onOpenPersonas={() => setPersonaManagerOpen(true)}
        onOpenTheme={() => setThemePickerOpen(true)}
        onOpenExport={() => setExportDialogOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[var(--theme-bg,#212121)]">
        {/* Mobile header */}
        <div className="md:hidden flex items-center p-3 border-b border-[var(--theme-border,#2f2f2f)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 text-sm font-medium text-white">
            {activePersona.id !== "default" ? activePersona.name : "GPT-4o"}
          </span>
        </div>

        {activeId ? (
          <ChatArea
            key={activeId}
            conversationId={activeId}
            memories={memories}
            persona={activePersona}
            onFirstMessage={handleFirstMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={ensureConversation}
              className="px-6 py-3 bg-[var(--theme-accent,#10a37f)] text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
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

      <KnowledgeBaseManager
        isOpen={kbManagerOpen}
        onClose={() => setKbManagerOpen(false)}
      />

      <PersonaManager
        isOpen={personaManagerOpen}
        onClose={() => setPersonaManagerOpen(false)}
        personas={personas}
        activePersonaId={activePersona.id}
        onSelect={selectPersona}
        onAdd={addPersona}
        onDelete={deletePersona}
      />

      <ThemePicker
        isOpen={themePickerOpen}
        onClose={() => setThemePickerOpen(false)}
        currentThemeId={themeId}
        onSelectTheme={setTheme}
      />

      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        conversationId={activeId}
      />
    </div>
  );
}
