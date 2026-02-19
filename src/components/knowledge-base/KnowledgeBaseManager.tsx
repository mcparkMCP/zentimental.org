"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Trash2 } from "lucide-react";
import { KBUpload } from "./KBUpload";
import { KBDocumentList } from "./KBDocumentList";
import { KB_MAX_DOCUMENTS } from "@/lib/constants";
import type { KBDocument } from "@/types/knowledge-base";

interface KnowledgeBaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KnowledgeBaseManager({ isOpen, onClose }: KnowledgeBaseManagerProps) {
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge-base");
      const data = await res.json();
      setDocuments(data.documents ?? []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, fetchDocuments]);

  const handleUploadComplete = useCallback((doc: KBDocument) => {
    setDocuments((prev) => [...prev, doc]);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/knowledge-base/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    } finally {
      setIsDeleting(null);
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    for (const doc of documents) {
      await fetch(`/api/knowledge-base/${doc.id}`, { method: "DELETE" });
    }
    setDocuments([]);
  }, [documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#212121] rounded-2xl shadow-2xl border border-[#2f2f2f] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#212121] flex items-center justify-between p-4 border-b border-[#2f2f2f] z-10">
          <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <KBUpload onUploadComplete={handleUploadComplete} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">
                Documents ({documents.length}/{KB_MAX_DOCUMENTS})
              </h3>
              {documents.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear All
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#10a37f] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <KBDocumentList
                documents={documents}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
