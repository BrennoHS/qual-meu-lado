import "server-only";
import { db } from "@/lib/db";

export const METRICS_FLAG = "aggregate-metrics";

let cache: { at: number; on: boolean } | null = null;

/**
 * Duas travas: variável de ambiente no servidor E chave ligada no painel
 * (que exige referência de parecer jurídico). Sem as duas, nada é contado
 * e o navegador nem chega a enviar requisições.
 */
export async function isMetricsEnabled(): Promise<boolean> {
  if (process.env.AGGREGATE_METRICS_ENABLED !== "true") return false;
  if (cache && Date.now() - cache.at < 60_000) return cache.on;
  try {
    const f = await db.featureFlag.findUnique({ where: { key: METRICS_FLAG } });
    cache = { at: Date.now(), on: !!f?.enabled };
  } catch {
    cache = { at: Date.now(), on: false };
  }
  return cache.on;
}

export function resetMetricsCache() {
  cache = null;
}
