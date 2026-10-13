/**
 * Vibração curta no celular para dar "peso" a uma ação (responder, concluir).
 * Só onde o navegador suporta (Android); no iPhone e no computador não faz nada.
 * Respeita "reduzir movimento" do sistema.
 */
const PATTERNS = { tap: 8, choose: 14, success: [12, 60, 18], tick: 5 } as const;
export type Haptic = keyof typeof PATTERNS;

export function haptic(kind: Haptic = "tap") {
  if (typeof window === "undefined" || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  try {
    navigator.vibrate(PATTERNS[kind] as number | number[]);
  } catch {
    /* sem suporte: ignora */
  }
}
