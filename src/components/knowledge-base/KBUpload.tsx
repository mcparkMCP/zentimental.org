"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { KB_ACCEPTED_FILE_TYPES, KB_MAX_FILE_SIZE } from "@/lib/constants";
import type { KBDocument } from "@/types/knowledge-base";

interface KBUploadProps {
  onUploadComplete: (doc: KBDocument) => void;
}

export function KBUpload({ onUploadComplete }: KBUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > KB_MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${KB_MAX_FILE_SIZE / 1024 / 1024}MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    setError(null);
    setProgress("Uploading and processing...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/knowledge-base/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setProgress(`Uploaded "${data.document.filename}" (${data.document.chunkCount} chunks)`);
      onUploadComplete(data.document);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setProgress(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
        <Upload size={16} />
        Upload Document
      </h3>
      <p className="text-xs text-gray-400 mb-2">
        Upload PDF, text, code, or other document files. Content will be chunked and indexed
        for automatic retrieval during chats.
      </p>
      <input
        ref={fileRef}
        type="file"
        accept={KB_ACCEPTED_FILE_TYPES}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#2f2f2f] file:text-white hover:file:bg-[#3f3f3f] file:cursor-pointer disabled:opacity-50"
      />
      {uploading && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-[#10a37f] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">{progress}</span>
        </div>
      )}
      {!uploading && progress && (
        <p className="mt-2 text-xs text-green-400">{progress}</p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
