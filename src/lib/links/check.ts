/**
 * Verificador de links das fontes. Usado pelo painel ("Verificar links")
 * e pelo script `npm run links:check` (ideal para um cron diário).
 *
 *  2xx/3xx       → OK
 *  401/403/429   → BLOCKED (portal bloqueia robôs; exige conferência manual)
 *  404/410/5xx/erro de rede → BROKEN
 */
import type { PrismaClient } from "@prisma/client";

export type LinkResult = { status: "OK" | "BLOCKED" | "BROKEN"; code: number | null };

const UA = "Mozilla/5.0 (compatible; DoisLadosLinkChecker/1.0; +https://doislados.example/como-construimos)";

export async function checkUrl(url: string, timeoutMs = 12_000): Promise<LinkResult> {
  const attempt = async (method: "HEAD" | "GET") => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA, Accept: "text/html,application/pdf,*/*" } });
      return res.status;
    } finally {
      clearTimeout(t);
    }
  };
  try {
    let code = await attempt("HEAD");
    if (code === 405 || code === 501) code = await attempt("GET");
    return { status: classify(code), code };
  } catch {
    return { status: "BROKEN", code: null };
  }
}

export function classify(code: number): LinkResult["status"] {
  if (code >= 200 && code < 400) return "OK";
  if (code === 401 || code === 403 || code === 429) return "BLOCKED";
  return "BROKEN";
}

export async function checkAllSources(db: PrismaClient, opts: { concurrency?: number; onlyStale?: boolean } = {}) {
  const sources = await db.source.findMany({
    where: { url: { not: null }, ...(opts.onlyStale ? { OR: [{ linkCheckedAt: null }, { linkCheckedAt: { lt: new Date(Date.now() - 24 * 3600 * 1000) } }] } : {}) },
    select: { id: true, url: true, title: true },
  });
  const results: { id: string; title: string; url: string; result: LinkResult }[] = [];
  const queue = [...sources];
  const workers = Array.from({ length: opts.concurrency ?? 6 }, async () => {
    while (queue.length) {
      const s = queue.shift()!;
      const result = await checkUrl(s.url!);
      results.push({ id: s.id, title: s.title, url: s.url!, result });
      await db.source.update({ where: { id: s.id }, data: { linkStatus: result.status, linkHttpCode: result.code, linkCheckedAt: new Date() } });
    }
  });
  await Promise.all(workers);
  return results;
}
