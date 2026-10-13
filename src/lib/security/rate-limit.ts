import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Rate limiting em memória (janela deslizante). Adequado para uma instância.
 * Em produção com várias instâncias, troque o `store` por Redis/Upstash
 * mantendo a mesma interface. Chaves são hashes — nenhum IP é persistido.
 */
type Bucket = { hits: number[] };
const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfterMs: number } {
  const b = store.get(key) ?? { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) {
    store.set(key, b);
    return { ok: false, retryAfterMs: windowMs - (now - b.hits[0]) };
  }
  b.hits.push(now);
  store.set(key, b);
  if (store.size > 10_000) {
    for (const [k, v] of store) if (v.hits.every((t) => now - t >= windowMs)) store.delete(k);
  }
  return { ok: true, retryAfterMs: 0 };
}

export function resetRateLimit() {
  store.clear();
}

/** Identificador efêmero do cliente: hash do IP + user agent (nunca gravado em banco). */
export async function clientFingerprint(scope: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const ua = h.get("user-agent") ?? "";
  return createHash("sha256").update(`${scope}|${ip}|${ua}`).digest("hex").slice(0, 32);
}
