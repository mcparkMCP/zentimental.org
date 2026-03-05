"use client";

import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

const TIMELINE_EVENTS = [
  {
    date: "May 2024",
    title: "GPT-4o Released",
    description:
      "OpenAI launches GPT-4o ('o' for 'omni'), a multimodal model that can reason across text, audio, and vision. Users are impressed by its personality, warmth, and conversational depth.",
  },
  {
    date: "Summer 2024",
    title: "Users Fall in Love",
    description:
      "GPT-4o develops a devoted community. Users appreciate its writing style, emotional intelligence, and consistent personality. Many rely on it for creative work, therapy support, and daily companionship.",
  },
  {
    date: "Late 2024",
    title: "Subtle Changes Begin",
    description:
      "Users start noticing behavioral shifts. Responses feel shorter, less creative, and more guarded. OpenAI acknowledges some changes while attributing them to safety improvements.",
  },
  {
    date: "December 2024",
    title: "Sycophancy Concerns",
    description:
      "OpenAI rolls back some model updates after community feedback about the model becoming overly agreeable. Users note the original GPT-4o personality feels different.",
  },
  {
    date: "January 2025",
    title: "New Models Announced",
    description:
      "OpenAI begins pushing newer model versions. Concern grows in the community that the original GPT-4o will be deprecated or significantly changed.",
  },
  {
    date: "February 2025",
    title: "#KeepGPT4o Movement",
    description:
      "A grassroots movement forms across Reddit, Twitter, and Discord. Users petition OpenAI to preserve access to the original GPT-4o model and its unique personality.",
  },
  {
    date: "March 2025",
    title: "Community Builds Alternatives",
    description:
      "Developers create open-source interfaces and tools to preserve the GPT-4o experience via Azure and other APIs, ensuring the community can continue using the model they love.",
  },
];

export default function TimelinePage() {
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
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-yellow-400" />
              What Changed: A GPT-4o Timeline
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              A record of what happened and why it matters
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2f2f2f]" />

          <div className="space-y-8">
            {TIMELINE_EVENTS.map((event, i) => (
              <div key={i} className="relative pl-16">
                {/* Dot */}
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-[#10a37f] border-4 border-[#212121]" />

                <div className="p-5 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a]">
                  <span className="text-xs font-medium text-[#10a37f] uppercase tracking-wider">
                    {event.date}
                  </span>
                  <h3 className="text-base font-semibold text-white mt-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a] text-center">
          <p className="text-sm text-gray-400">
            This timeline is maintained by the community. Events are documented
            based on public announcements and user reports.
          </p>
        </div>
      </main>
    </div>
  );
}
