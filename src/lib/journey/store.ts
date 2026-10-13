"use client";

import { useSyncExternalStore } from "react";
import type { Answer } from "@/lib/affinity/score";

/**
 * Estado local da jornada (somente neste navegador).
 * NUNCA é enviado ao servidor. O visitante pode apagar tudo em /meu-percurso.
 */
const KEY = "doislados:journey:v1";

export type Choice = "esquerda" | "direita" | "ambos" | "indeciso";

export type JourneyState = {
  answers: Record<string, Answer>;
  visited: { side: string; chapter: string; at: number }[];
  /** Escolha final opcional, feita pelo visitante em /sua-escolha. */
  choice?: Choice;
};

const empty: JourneyState = { answers: {}, visited: [] };
let cache: JourneyState | null = null;
const listeners = new Set<() => void>();

function read(): JourneyState {
  if (cache) return cache;
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    const parsed = raw ? (JSON.parse(raw) as Partial<JourneyState>) : {};
    cache = {
      answers: parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {},
      visited: Array.isArray(parsed.visited) ? parsed.visited.slice(-200) : [],
      choice: parsed.choice,
    };
  } catch {
    cache = { ...empty };
  }
  return cache;
}

function write(next: JourneyState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* armazenamento indisponível (modo privado, cota) — segue apenas em memória */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useJourney(): JourneyState {
  return useSyncExternalStore(subscribe, read, () => empty);
}

export function setAnswer(statementKey: string, answer: Answer | null) {
  const s = read();
  const answers = { ...s.answers };
  if (answer === null) delete answers[statementKey];
  else answers[statementKey] = answer;
  write({ ...s, answers });
}

export function markVisited(side: string, chapter: string) {
  const s = read();
  if (s.visited.some((v) => v.side === side && v.chapter === chapter)) return;
  write({ ...s, visited: [...s.visited, { side, chapter, at: Date.now() }] });
}

export function setChoice(choice: Choice | null) {
  const s = read();
  write({ ...s, choice: choice ?? undefined });
}

export function clearJourney() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem("doislados:reel:v1"); // "continuar de onde parei"
  } catch {
    /* ignore */
  }
  write({ answers: {}, visited: [] });
}
