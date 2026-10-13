"use client";

/**
 * Lado do navegador da medição agregada. Desligado até o servidor dizer o
 * contrário (configureMetrics). Respeita "Global Privacy Control" e "Do Not
 * Track". Envia NO MÁXIMO uma requisição por reel, ao sair da página, com a
 * tela mais funda alcançada — nada de clique a clique.
 */
let enabled = false;
const deepest = new Map<string, { index: number; key: string }>();
let bound = false;

function optedOut() {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.globalPrivacyControl === true || n.doNotTrack === "1";
}

function flush() {
  if (!enabled || deepest.size === 0) return;
  for (const [reel, d] of deepest) {
    const body = JSON.stringify({ e: "reel_depth", k: `${reel}:${d.key}` });
    try {
      if (!navigator.sendBeacon?.("/api/m", new Blob([body], { type: "application/json" }))) {
        void fetch("/api/m", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      /* ignora */
    }
  }
  deepest.clear();
}

export function configureMetrics(on: boolean) {
  enabled = on && typeof window !== "undefined" && !optedOut();
  if (enabled && !bound) {
    bound = true;
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  }
}

/** reel: "esquerda" | "direita" | "segundo-turno" (sem candidatura). */
export function trackDepth(reel: "esquerda" | "direita" | "segundo-turno", index: number, key: string) {
  if (!enabled) return;
  const cur = deepest.get(reel);
  if (!cur || index > cur.index) deepest.set(reel, { index, key });
}
