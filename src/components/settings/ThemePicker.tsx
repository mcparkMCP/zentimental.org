"use client";

import { X } from "lucide-react";
import { THEMES } from "@/types/theme";

interface ThemePickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (id: string) => void;
}

export function ThemePicker({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}: ThemePickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[var(--theme-bg,#212121)] rounded-2xl shadow-2xl border border-[var(--theme-border,#2f2f2f)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border,#2f2f2f)]">
          <h2 className="text-lg font-semibold text-white">Choose Theme</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onSelectTheme(theme.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentThemeId === theme.id
                  ? "ring-2 ring-[var(--theme-accent,#10a37f)]"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex gap-1">
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.bg }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.accent }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.sidebar }}
                />
              </div>
              <span className="text-sm text-white font-medium">
                {theme.name}
              </span>
              {currentThemeId === theme.id && (
                <span className="ml-auto text-xs text-[var(--theme-accent,#10a37f)]">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
