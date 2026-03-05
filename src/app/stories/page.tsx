"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Story } from "@/types/story";
import { MAX_STORY_LENGTH, MAX_STORY_NAME_LENGTH } from "@/lib/constants";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((d) => setStories(d.stories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !text.trim() || submitting) return;
      setSubmitting(true);
      try {
        const res = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), text: text.trim() }),
        });
        if (res.ok) {
          const data = await res.json();
          setStories((prev) => [data.story, ...prev]);
          setName("");
          setText("");
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        }
      } catch {
        // ignore
      } finally {
        setSubmitting(false);
      }
    },
    [name, text, submitting]
  );

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
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Heart size={20} className="text-red-400" />
              My GPT-4o Story
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Share why GPT-4o matters to you
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Submit form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-6 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a]"
        >
          <h2 className="text-lg font-semibold mb-4">Share Your Story</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (or anonymous)"
            maxLength={MAX_STORY_NAME_LENGTH}
            className="w-full bg-[#2f2f2f] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none border border-[#3f3f3f] focus:border-[#10a37f] mb-3"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us why GPT-4o matters to you..."
            maxLength={MAX_STORY_LENGTH}
            rows={4}
            className="w-full bg-[#2f2f2f] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none resize-none border border-[#3f3f3f] focus:border-[#10a37f]"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {text.length}/{MAX_STORY_LENGTH}
            </span>
            <button
              type="submit"
              disabled={!name.trim() || !text.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#10a37f] text-white rounded-xl hover:bg-[#0d8c6d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {submitted ? "Shared!" : "Share Story"}
            </button>
          </div>
        </form>

        {/* Story wall */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">
              No stories yet. Be the first to share yours!
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="break-inside-avoid p-5 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a] hover:border-[#3f3f3f] transition-colors"
              >
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  &ldquo;{story.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#10a37f]">
                    &mdash; {story.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
