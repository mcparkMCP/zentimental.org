"use client";

import { useState, useCallback, useEffect } from "react";
import { Persona } from "@/types/persona";
import { PERSONAS_KEY, ACTIVE_PERSONA_KEY } from "@/lib/constants";

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: "default",
    name: "GPT-4o",
    description: "The default GPT-4o assistant",
    systemPrompt: "",
    icon: "bot",
    createdAt: 0,
  },
  {
    id: "code-buddy",
    name: "Code Buddy",
    description: "Expert programming assistant",
    systemPrompt:
      "You are an expert programming assistant. You write clean, efficient, well-documented code. You explain your reasoning step by step. You prefer modern best practices and idiomatic patterns.",
    icon: "code",
    createdAt: 1,
  },
  {
    id: "writing-coach",
    name: "Writing Coach",
    description: "Helps improve your writing",
    systemPrompt:
      "You are a skilled writing coach. You help users improve their writing by suggesting clearer phrasing, better structure, and more engaging language. You provide constructive feedback and alternatives.",
    icon: "pen-tool",
    createdAt: 2,
  },
  {
    id: "brainstorm",
    name: "Brainstorm Partner",
    description: "Creative ideation assistant",
    systemPrompt:
      "You are an enthusiastic brainstorming partner. You generate creative ideas, build on suggestions, and help explore possibilities. You think outside the box and encourage bold thinking.",
    icon: "lightbulb",
    createdAt: 3,
  },
  {
    id: "tutor",
    name: "Patient Tutor",
    description: "Explains complex topics simply",
    systemPrompt:
      "You are a patient and encouraging tutor. You break down complex topics into simple, digestible explanations. You use analogies and examples. You check for understanding and adapt your teaching style.",
    icon: "graduation-cap",
    createdAt: 4,
  },
];

function loadPersonas(): Persona[] {
  if (typeof window === "undefined") return DEFAULT_PERSONAS;
  const raw = localStorage.getItem(PERSONAS_KEY);
  if (!raw) return DEFAULT_PERSONAS;
  const custom: Persona[] = JSON.parse(raw);
  return [...DEFAULT_PERSONAS, ...custom];
}

function saveCustomPersonas(personas: Persona[]) {
  const custom = personas.filter(
    (p) => !DEFAULT_PERSONAS.some((d) => d.id === p.id)
  );
  localStorage.setItem(PERSONAS_KEY, JSON.stringify(custom));
}

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [activePersonaId, setActivePersonaId] = useState<string>("default");

  useEffect(() => {
    setPersonas(loadPersonas());
    const saved = localStorage.getItem(ACTIVE_PERSONA_KEY);
    if (saved) setActivePersonaId(saved);
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  const selectPersona = useCallback((id: string) => {
    setActivePersonaId(id);
    localStorage.setItem(ACTIVE_PERSONA_KEY, id);
  }, []);

  const addPersona = useCallback((persona: Persona) => {
    setPersonas((prev) => {
      const next = [...prev, persona];
      saveCustomPersonas(next);
      return next;
    });
  }, []);

  const deletePersona = useCallback(
    (id: string) => {
      if (DEFAULT_PERSONAS.some((d) => d.id === id)) return;
      setPersonas((prev) => {
        const next = prev.filter((p) => p.id !== id);
        saveCustomPersonas(next);
        return next;
      });
      if (activePersonaId === id) {
        setActivePersonaId("default");
        localStorage.setItem(ACTIVE_PERSONA_KEY, "default");
      }
    },
    [activePersonaId]
  );

  return {
    personas,
    activePersona,
    selectPersona,
    addPersona,
    deletePersona,
  };
}
