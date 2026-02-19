"use client";

import { X, Trash2 } from "lucide-react";
import { Memory } from "@/types/memory";
import { MemoryImport } from "./MemoryImport";
import { MemoryList } from "./MemoryList";
import { MAX_MEMORIES } from "@/lib/constants";

interface MemoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onAddMemories: (memories: Memory[]) => void;
  onDeleteMemory: (id: string) => void;
  onUpdateMemory: (id: string, content: string) => void;
  onClearMemories: () => void;
}

export function MemoryManager({
  isOpen,
  onClose,
  memories,
  onAddMemories,
  onDeleteMemory,
  onUpdateMemory,
  onClearMemories,
}: MemoryManagerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#212121] rounded-2xl shadow-2xl border border-[#2f2f2f] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#212121] flex items-center justify-between p-4 border-b border-[#2f2f2f] z-10">
          <h2 className="text-lg font-semibold text-white">Memory Manager</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <MemoryImport onImport={onAddMemories} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">
                Memories ({memories.length}/{MAX_MEMORIES})
              </h3>
              {memories.length > 0 && (
                <button
                  onClick={onClearMemories}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear All
                </button>
              )}
            </div>
            <MemoryList
              memories={memories}
              onDelete={onDeleteMemory}
              onUpdate={onUpdateMemory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
