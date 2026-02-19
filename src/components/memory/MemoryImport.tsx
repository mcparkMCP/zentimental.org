"use client";

import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Memory } from "@/types/memory";
import { parseMemoriesFromZip, parseMemoriesFromText } from "@/lib/memory-parser";

interface MemoryImportProps {
  onImport: (memories: Memory[]) => void;
}

export function MemoryImport({ onImport }: MemoryImportProps) {
  const [pasteText, setPasteText] = useState("");
  const [zipStatus, setZipStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    const memories = parseMemoriesFromText(pasteText);
    onImport(memories);
    setPasteText("");
  };

  const handleZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setZipStatus("Parsing ZIP...");
    const result = await parseMemoriesFromZip(file);

    if (result.error) {
      setZipStatus(result.error);
      return;
    }

    const parts: string[] = [];
    if (result.conversationCount > 0) {
      parts.push(`Found ${result.conversationCount} conversations`);
    }
    if (result.memories.length > 0) {
      parts.push(`Imported ${result.memories.length} memories`);
      onImport(result.memories);
    } else {
      parts.push("No memories file found in export (this is normal — ChatGPT doesn't include memories in exports)");
    }
    setZipStatus(parts.join(". ") + ".");

    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Paste memories */}
      <div>
        <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <FileText size={16} />
          Paste Memories
        </h3>
        <p className="text-xs text-gray-400 mb-2">
          Go to ChatGPT → Settings → Personalization → Memory → Manage → copy your
          memories and paste below (one per line).
        </p>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="The user prefers Python over JavaScript&#10;The user's name is Alex&#10;The user works at a startup..."
          rows={5}
          className="w-full bg-[#2f2f2f] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none border border-[#3f3f3f] focus:border-[#10a37f]"
        />
        <button
          onClick={handlePaste}
          disabled={!pasteText.trim()}
          className="mt-2 px-4 py-2 bg-[#10a37f] text-white text-sm rounded-lg hover:bg-[#0d8c6d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Import Memories
        </button>
      </div>

      {/* ZIP upload */}
      <div>
        <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <Upload size={16} />
          Upload ChatGPT Export ZIP
        </h3>
        <p className="text-xs text-gray-400 mb-2">
          Upload your ChatGPT data export ZIP. We&apos;ll look for any memory data
          and show your conversation count as confirmation.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".zip"
          onChange={handleZip}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#2f2f2f] file:text-white hover:file:bg-[#3f3f3f] file:cursor-pointer"
        />
        {zipStatus && (
          <p className="mt-2 text-xs text-gray-400">{zipStatus}</p>
        )}
      </div>
    </div>
  );
}
