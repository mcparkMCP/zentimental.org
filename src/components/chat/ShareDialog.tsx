"use client";

import { useState, useCallback } from "react";
import { X, Copy, Check, Loader2 } from "lucide-react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function ShareDialog({
  isOpen,
  onClose,
  shareUrl,
  isLoading,
  error,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!shareUrl) return;
    const fullUrl = `${window.location.origin}${shareUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#2f2f2f] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Share Conversation
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 py-6 justify-center text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span>Creating share link...</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {shareUrl && !isLoading && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              Anyone with this link can view a read-only copy of this
              conversation.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}${shareUrl}`}
                className="flex-1 bg-[#1e1e1e] border border-[#444] rounded-lg px-3 py-2 text-sm text-white outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#10a37f] text-white rounded-lg hover:bg-[#0d8c6d] transition-colors text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
