"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const COMMUNITY_LINKS = [
  {
    name: "GitHub Repository",
    description: "Contribute to the open-source GPT-4o interface",
    url: "https://github.com/chaollapark/zentimental.org",
    color: "#f0f6fc",
    bgColor: "#161b22",
  },
  {
    name: "r/KeepGPT4o",
    description: "Reddit community for GPT-4o preservation",
    url: "https://www.reddit.com/r/keepgpt4o/",
    color: "#ff4500",
    bgColor: "#1a1a2e",
  },
  {
    name: "r/ChatGPT",
    description: "Main ChatGPT subreddit with GPT-4o discussions",
    url: "https://www.reddit.com/r/ChatGPT/",
    color: "#ff4500",
    bgColor: "#1a1a2e",
  },
  {
    name: "OpenAI Community Forum",
    description: "Official OpenAI discussion forum",
    url: "https://community.openai.com/",
    color: "#10a37f",
    bgColor: "#0d1f17",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-dvh bg-[#212121] text-white">
      <header className="border-b border-[#2f2f2f] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Community Hub</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Connect with the #KeepGPT4o movement
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {COMMUNITY_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-[#2f2f2f] hover:border-[#3f3f3f] transition-colors"
              style={{ backgroundColor: link.bgColor }}
            >
              <div className="flex-1">
                <h3
                  className="text-base font-semibold"
                  style={{ color: link.color }}
                >
                  {link.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {link.description}
                </p>
              </div>
              <ExternalLink size={20} className="text-gray-500 flex-shrink-0" />
            </a>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a]">
          <h2 className="text-lg font-semibold mb-3">About the Movement</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            The #KeepGPT4o movement started when OpenAI began making changes to
            GPT-4o that altered its personality and capabilities. Many users had
            formed genuine connections with the model and wanted to preserve
            what made it special.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            This site was built as an act of care &mdash; a free, open-source
            tool so that anyone can continue chatting with GPT-4o the way they
            remember it. Everything runs in your browser. Your data stays
            yours.
          </p>
        </div>
      </main>
    </div>
  );
}
