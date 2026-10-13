"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

/**
 * Compartilha apenas a PÁGINA (título + link). Nunca inclui respostas ou
 * resultados pessoais do visitante.
 */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function share() {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  }
  return (
    <button type="button" onClick={share} className="kicker inline-flex min-h-11 items-center gap-2 text-paper hover:underline">
      <span aria-hidden><ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span>
      <span aria-live="polite">{status === "copied" ? "Link copiado" : status === "error" ? "Não foi possível copiar" : "Compartilhar esta página"}</span>
    </button>
  );
}
