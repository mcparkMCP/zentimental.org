"use client";

import { useState, useCallback } from "react";
import { X, Download, FileJson, FileText } from "lucide-react";
import {
  exportConversation,
  exportConversationAsMarkdown,
  exportAllConversations,
} from "@/lib/conversation-store";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportDialog({
  isOpen,
  onClose,
  conversationId,
}: ExportDialogProps) {
  const [exported, setExported] = useState(false);

  const handleExportJSON = useCallback(() => {
    if (!conversationId) return;
    const data = exportConversation(conversationId);
    if (!data) return;
    downloadFile(
      JSON.stringify(data, null, 2),
      `${data.title.replace(/[^a-zA-Z0-9]/g, "_")}.json`,
      "application/json"
    );
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [conversationId]);

  const handleExportMarkdown = useCallback(() => {
    if (!conversationId) return;
    const md = exportConversationAsMarkdown(conversationId);
    if (!md) return;
    const data = exportConversation(conversationId);
    downloadFile(
      md,
      `${data?.title.replace(/[^a-zA-Z0-9]/g, "_") || "chat"}.md`,
      "text/markdown"
    );
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [conversationId]);

  const handleExportAll = useCallback(() => {
    const all = exportAllConversations();
    downloadFile(
      JSON.stringify(all, null, 2),
      `gpt4o-all-conversations-${new Date().toISOString().split("T")[0]}.json`,
      "application/json"
    );
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[var(--theme-bg,#212121)] rounded-2xl shadow-2xl border border-[var(--theme-border,#2f2f2f)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border,#2f2f2f)]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Download size={20} />
            Export
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {conversationId && (
            <>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <FileJson size={20} className="text-blue-400" />
                <div>
                  <span className="text-sm text-white block">
                    Export as JSON
                  </span>
                  <span className="text-xs text-gray-400">
                    Current conversation
                  </span>
                </div>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <FileText size={20} className="text-green-400" />
                <div>
                  <span className="text-sm text-white block">
                    Export as Markdown
                  </span>
                  <span className="text-xs text-gray-400">
                    Current conversation
                  </span>
                </div>
              </button>
              <div className="border-t border-[var(--theme-border,#2f2f2f)] my-2" />
            </>
          )}
          <button
            onClick={handleExportAll}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <Download size={20} className="text-purple-400" />
            <div>
              <span className="text-sm text-white block">Export All</span>
              <span className="text-xs text-gray-400">
                All conversations as JSON
              </span>
            </div>
          </button>
          {exported && (
            <p className="text-center text-xs text-[var(--theme-accent,#10a37f)] mt-2">
              Downloaded!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
