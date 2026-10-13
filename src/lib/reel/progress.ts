"use client";

/**
 * "Continuar de onde parei": a última tela vista de cada reel.
 * Fica SÓ neste navegador (localStorage) e é apagada junto com o percurso.
 */
export const PROGRESS_KEY = "doislados:reel:v1";

export type ReelProgress = { key: string; index: number; total: number; label: string; href: string; at: number };

export function readProgress(): Record<string, ReelProgress> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, ReelProgress>;
  } catch {
    return {};
  }
}

export function saveProgress(id: string, p: Omit<ReelProgress, "at">) {
  try {
    const all = readProgress();
    all[id] = { ...p, at: Date.now() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    /* sem armazenamento: tudo bem */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* ignora */
  }
}

/** O reel mais recente que ficou pela metade (para a home). */
export function latestUnfinished(maxAgeDays = 30): (ReelProgress & { id: string }) | null {
  const now = Date.now();
  const list = Object.entries(readProgress())
    .map(([id, p]) => ({ id, ...p }))
    .filter((p) => p.index > 0 && p.index < p.total - 1 && now - p.at < maxAgeDays * 86_400_000)
    .sort((a, b) => b.at - a.at);
  return list[0] ?? null;
}
