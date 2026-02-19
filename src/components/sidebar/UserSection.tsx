"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, RefreshCw } from "lucide-react";

export type SyncStatus = "idle" | "syncing" | "done" | "error";

interface UserSectionProps {
  syncStatus: SyncStatus;
  onSync: () => void;
}

export function UserSection({ syncStatus, onSync }: UserSectionProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-3 border-t border-[#2f2f2f]">
        <div className="h-8 bg-[#2f2f2f] rounded animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-3 border-t border-[#2f2f2f]">
        <button
          onClick={() => signIn("github")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#2f2f2f] hover:text-white transition-colors"
        >
          <LogIn size={16} />
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-[#2f2f2f] space-y-1">
      <div className="flex items-center gap-2 px-3 py-1.5">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm text-gray-300 truncate flex-1">
          {session.user.name || session.user.email}
        </span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onSync}
          disabled={syncStatus === "syncing"}
          className="flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-[#2f2f2f] hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={syncStatus === "syncing" ? "animate-spin" : ""}
          />
          {syncStatus === "syncing"
            ? "Syncing..."
            : syncStatus === "done"
            ? "Synced"
            : syncStatus === "error"
            ? "Sync failed"
            : "Sync now"}
        </button>
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-[#2f2f2f] hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}
