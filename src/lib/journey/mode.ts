"use client";

import { useSyncExternalStore } from "react";

/** Modo de leitura: "essencial" (fundamentos) ou "aprofundado" (tudo). Preferência local. */
export type ReadingMode = "essencial" | "aprofundado";
const KEY = "doislados:mode";
const listeners = new Set<() => void>();

function read(): ReadingMode {
  try {
    return localStorage.getItem(KEY) === "aprofundado" ? "aprofundado" : "essencial";
  } catch {
    return "essencial";
  }
}

export function setReadingMode(mode: ReadingMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* sem armazenamento: vale só nesta visita */
  }
  listeners.forEach((l) => l());
}

export function useReadingMode(): ReadingMode {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "essencial",
  );
}
