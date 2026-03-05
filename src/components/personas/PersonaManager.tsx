"use client";

import { useState } from "react";
import { X, Plus, Trash2, Check } from "lucide-react";
import type { Persona } from "@/types/persona";

interface PersonaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  personas: Persona[];
  activePersonaId: string;
  onSelect: (id: string) => void;
  onAdd: (persona: Persona) => void;
  onDelete: (id: string) => void;
}

const BUILTIN_IDS = ["default", "code-buddy", "writing-coach", "brainstorm", "tutor"];

export function PersonaManager({
  isOpen,
  onClose,
  personas,
  activePersonaId,
  onSelect,
  onAdd,
  onDelete,
}: PersonaManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const handleCreate = () => {
    if (!newName.trim() || !newPrompt.trim()) return;
    const persona: Persona = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      description: newDescription.trim(),
      systemPrompt: newPrompt.trim(),
      icon: "user",
      createdAt: Date.now(),
    };
    onAdd(persona);
    setNewName("");
    setNewDescription("");
    setNewPrompt("");
    setShowCreate(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--theme-bg,#212121)] rounded-2xl shadow-2xl border border-[var(--theme-border,#2f2f2f)] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[var(--theme-bg,#212121)] flex items-center justify-between p-4 border-b border-[var(--theme-border,#2f2f2f)] z-10">
          <h2 className="text-lg font-semibold text-white">Personas</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                activePersonaId === persona.id
                  ? "bg-[var(--theme-accent,#10a37f)]/10 ring-1 ring-[var(--theme-accent,#10a37f)]"
                  : "hover:bg-white/5"
              }`}
              onClick={() => onSelect(persona.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {persona.name}
                  </span>
                  {activePersonaId === persona.id && (
                    <Check size={14} className="text-[var(--theme-accent,#10a37f)]" />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {persona.description}
                </p>
              </div>
              {!BUILTIN_IDS.includes(persona.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(persona.id);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          {showCreate ? (
            <div className="mt-4 p-4 rounded-xl border border-[var(--theme-border,#2f2f2f)] space-y-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Persona name"
                className="w-full bg-[var(--theme-input,#2f2f2f)] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-[var(--theme-border,#2f2f2f)] focus:border-[var(--theme-accent,#10a37f)]"
              />
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Short description"
                className="w-full bg-[var(--theme-input,#2f2f2f)] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-[var(--theme-border,#2f2f2f)] focus:border-[var(--theme-accent,#10a37f)]"
              />
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="System prompt..."
                rows={4}
                className="w-full bg-[var(--theme-input,#2f2f2f)] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none border border-[var(--theme-border,#2f2f2f)] focus:border-[var(--theme-accent,#10a37f)]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || !newPrompt.trim()}
                  className="px-4 py-1.5 text-sm bg-[var(--theme-accent,#10a37f)] text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--theme-border,#2f2f2f)] text-sm text-gray-400 hover:text-white hover:border-gray-400 transition-colors mt-4"
            >
              <Plus size={16} />
              Create Custom Persona
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
