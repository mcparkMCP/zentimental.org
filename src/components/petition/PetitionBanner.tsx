"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Loader2, Check } from "lucide-react";

export function PetitionBanner() {
  const [count, setCount] = useState<number | null>(null);
  const [recentNames, setRecentNames] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const alreadySigned = localStorage.getItem("gpt4o-petition-signed");
    if (alreadySigned) setSigned(true);

    fetch("/api/petition")
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count ?? 0);
        setRecentNames(d.recentNames ?? []);
      })
      .catch(() => {});
  }, []);

  const handleSign = useCallback(async () => {
    if (!name.trim() || signing) return;
    setSigning(true);
    try {
      const res = await fetch("/api/petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
        setSigned(true);
        setShowInput(false);
        localStorage.setItem("gpt4o-petition-signed", "true");
      }
    } catch {
      // ignore
    } finally {
      setSigning(false);
    }
  }, [name, signing]);

  return (
    <div className="p-4 rounded-2xl border border-[#2f2f2f] bg-[#1a1a1a]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <Heart size={20} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            I Stand With GPT-4o
          </h3>
          <p className="text-xs text-gray-400">
            {count !== null ? (
              <span className="text-[var(--theme-accent,#10a37f)] font-bold">
                {count.toLocaleString()}
              </span>
            ) : (
              "..."
            )}{" "}
            people have signed
          </p>
        </div>
      </div>

      {recentNames.length > 0 && (
        <p className="text-xs text-gray-500 mb-3 truncate">
          Recent: {recentNames.join(", ")}
        </p>
      )}

      {signed ? (
        <div className="flex items-center gap-2 text-sm text-[var(--theme-accent,#10a37f)]">
          <Check size={16} />
          <span>You signed!</span>
        </div>
      ) : showInput ? (
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            onKeyDown={(e) => e.key === "Enter" && handleSign()}
            className="flex-1 bg-[#2f2f2f] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-[#3f3f3f] focus:border-[var(--theme-accent,#10a37f)]"
          />
          <button
            onClick={handleSign}
            disabled={!name.trim() || signing}
            className="px-4 py-2 bg-[var(--theme-accent,#10a37f)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {signing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign"
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-2.5 bg-[var(--theme-accent,#10a37f)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Sign the Petition
        </button>
      )}
    </div>
  );
}
