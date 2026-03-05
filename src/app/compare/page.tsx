"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Send, Loader2, Copy, Check, Share2, Download } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ComparisonResult {
  prompt: string;
  response: string;
  timestamp: number;
}

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || loading) return;
      setLoading(true);
      setResult(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", parts: [{ type: "text", text: prompt }] }],
            systemPrompt: "You are ChatGPT, based on the GPT-4o architecture. Be helpful, creative, and friendly.",
          }),
        });

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE data - extract text parts
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                if (typeof text === "string") {
                  fullText += text;
                  setResult({
                    prompt,
                    response: fullText,
                    timestamp: Date.now(),
                  });
                }
              } catch {
                // skip non-text chunks
              }
            }
          }
        }

        if (!fullText) {
          setResult({
            prompt,
            response: "(No response received)",
            timestamp: Date.now(),
          });
        }
      } catch {
        setResult({
          prompt,
          response: "(Error: Could not get response)",
          timestamp: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    },
    [prompt, loading]
  );

  const handleCopyResponse = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleCopyCard = useCallback(() => {
    if (!result) return;
    const text = `Prompt: ${result.prompt}\n\nGPT-4o Response:\n${result.response}\n\n--- Shared from keepgpt4o ---`;
    navigator.clipboard.writeText(text);
    setCardCopied(true);
    setTimeout(() => setCardCopied(false), 2000);
  }, [result]);

  const handleDownloadCard = useCallback(() => {
    if (!result) return;
    const text = `# GPT-4o Response\n\n**Prompt:** ${result.prompt}\n\n**Response:**\n\n${result.response}\n\n---\n*Shared from keepgpt4o | ${new Date(result.timestamp).toLocaleDateString()}*`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gpt4o-comparison.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <div className="min-h-dvh bg-[#212121] text-white">
      <header className="border-b border-[#2f2f2f] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Comparison Playground</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              See how GPT-4o responds &mdash; create shareable comparison cards
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt to test with GPT-4o..."
              rows={3}
              className="flex-1 bg-[#2f2f2f] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none resize-none border border-[#3f3f3f] focus:border-[#10a37f]"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="px-6 py-3 bg-[#10a37f] text-white rounded-xl hover:bg-[#0d8c6d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>

        {result && (
          <div ref={cardRef} className="space-y-4">
            {/* Comparison card */}
            <div className="rounded-2xl border border-[#2f2f2f] overflow-hidden">
              <div className="bg-[#1a1a1a] px-5 py-3 border-b border-[#2f2f2f] flex items-center justify-between">
                <span className="text-sm font-medium text-[#10a37f]">
                  GPT-4o Response
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="p-5 bg-[#1a1a1a]">
                <div className="mb-4 p-3 rounded-xl bg-[#2f2f2f]">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Prompt
                  </span>
                  <p className="text-sm text-white mt-1">{result.prompt}</p>
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.response}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Share options */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCopyCard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2f2f2f] text-sm text-gray-400 hover:text-white hover:border-[#3f3f3f] transition-colors"
              >
                <Share2 size={14} />
                {cardCopied ? "Copied!" : "Copy as Text"}
              </button>
              <button
                onClick={handleDownloadCard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2f2f2f] text-sm text-gray-400 hover:text-white hover:border-[#3f3f3f] transition-colors"
              >
                <Download size={14} />
                Download Card
              </button>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              Enter a prompt above to see GPT-4o&apos;s response and create a shareable card.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
