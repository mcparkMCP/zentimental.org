"use client";

import { useState, useEffect, useCallback } from "react";
import { THEMES, type Theme } from "@/types/theme";
import { THEME_KEY } from "@/lib/constants";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.bg);
  root.style.setProperty("--theme-sidebar", theme.sidebar);
  root.style.setProperty("--theme-input", theme.input);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-user-bubble", theme.userBubble);
}

export function useTheme() {
  const [themeId, setThemeId] = useState("classic");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const id = saved || "classic";
    setThemeId(id);
    const theme = THEMES.find((t) => t.id === id) || THEMES[0];
    applyTheme(theme);
  }, []);

  const setTheme = useCallback((id: string) => {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;
    setThemeId(id);
    localStorage.setItem(THEME_KEY, id);
    applyTheme(theme);
  }, []);

  return { themeId, setTheme, themes: THEMES };
}
