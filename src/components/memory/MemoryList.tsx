"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Memory } from "@/types/memory";

interface MemoryListProps {
  memories: Memory[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export function MemoryList({ memories, onDelete, onUpdate }: MemoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditText(memory.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdate(editingId, editText.trim());
    }
    cancelEdit();
  };

  if (memories.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No memories yet. Import or add memories above.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {memories.map((memory) => (
        <div
          key={memory.id}
          className="flex items-start gap-2 p-2 rounded-lg bg-[#2f2f2f] group"
        >
          {editingId === memory.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 bg-[#1a1a1a] rounded px-2 py-1 text-sm text-white outline-none border border-[#10a37f]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
              />
              <button onClick={saveEdit} className="p-1 text-green-400 hover:text-green-300">
                <Check size={14} />
              </button>
              <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-300">{memory.content}</span>
              <button
                onClick={() => startEdit(memory)}
                className="p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(memory.id)}
                className="p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
