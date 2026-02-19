"use client";

import { Trash2, FileText } from "lucide-react";
import type { KBDocument } from "@/types/knowledge-base";

interface KBDocumentListProps {
  documents: KBDocument[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function KBDocumentList({ documents, onDelete, isDeleting }: KBDocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No documents uploaded yet. Upload files above to build your knowledge base.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-[#2f2f2f] group"
        >
          <div className="flex-shrink-0 text-gray-400">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{doc.filename}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(doc.fileSize)} &middot; {doc.chunkCount} chunks &middot; {formatDate(doc.uploadedAt)}
            </p>
          </div>
          <button
            onClick={() => onDelete(doc.id)}
            disabled={isDeleting === doc.id}
            className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 disabled:opacity-50 transition-opacity"
            title="Delete document"
          >
            {isDeleting === doc.id ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
