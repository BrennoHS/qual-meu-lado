import { headers } from "next/headers";
import { db } from "@/lib/db";
import { metricPayload, RETENTION_DAYS } from "@/lib/metrics/schema";
import { isMetricsEnabled } from "@/lib/metrics/server";
import { clientFingerprint, rateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Recebe UM contador anônimo. Não grava IP, user agent, cookie, horário exato
 * nem identificador: só incrementa (dia, evento, chave). O hash usado no limite
 * de requisições vive apenas na memória do servidor.
 */
export async function POST(req: Request) {
  const noContent = new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (!(await isMetricsEnabled())) return noContent;

  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin || !host || new URL(origin).host !== host) return new Response(null, { status: 403 });

  const rl = rateLimit(`m:${await clientFingerprint("metrics")}`, 30, 60 * 60_000);
  if (!rl.ok) return noContent;

  let body: unknown;
  try {
    body = JSON.parse((await req.text()).slice(0, 300));
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = metricPayload.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  const day = new Date().toISOString().slice(0, 10);
  await db.metricDaily.upsert({
    where: { day_event_key: { day, event: parsed.data.e, key: parsed.data.k } },
    update: { count: { increment: 1 } },
    create: { day, event: parsed.data.e, key: parsed.data.k, count: 1 },
  });
  // Retenção: apaga o que passou do prazo (barato; roda em ~1% das chamadas).
  if (Math.random() < 0.01) {
    const limit = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString().slice(0, 10);
    await db.metricDaily.deleteMany({ where: { day: { lt: limit } } });
  }
  return noContent;
}

export function GET() {
  return new Response(null, { status: 405 });
}
