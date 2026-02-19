"use client";

import { SquarePen } from "lucide-react";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[#2f2f2f]">
      <span className="font-semibold text-sm text-white">GPT-4o</span>
      <button
        onClick={onNewChat}
        className="p-2 rounded-lg hover:bg-[#2f2f2f] transition-colors text-gray-400 hover:text-white"
        title="New chat"
      >
        <SquarePen size={18} />
      </button>
    </div>
  );
}
