"use client";

import { useEffect, useRef } from "react";

interface ScrollAnchorProps {
  trackVisibility?: boolean;
}

export function ScrollAnchor({ trackVisibility }: ScrollAnchorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    if (!trackVisibility || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trackVisibility]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only auto-scroll if the anchor is near the viewport
    if (!trackVisibility || isVisible.current) {
      el.scrollIntoView({ behavior: "instant", block: "end" });
    }
  });

  return <div ref={ref} className="h-px w-full" />;
}
