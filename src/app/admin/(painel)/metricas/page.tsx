import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { getSideReel } from "@/lib/content/reel";
import { ROUNDS } from "@/lib/election";
import { MIN_DISPLAY_COUNT, RETENTION_DAYS } from "@/lib/metrics/schema";
import { isMetricsEnabled } from "@/lib/metrics/server";

export const dynamic = "force-dynamic";

/**
 * Funil de desistência dos reels (uso interno da equipe editorial).
 * Mostra em que tela as pessoas param — para melhorar o conteúdo, não para
 * medir preferência. Números pequenos ficam ocultos.
 */
export default async function MetricsPage() {
  await requireUser();
  const on = await isMetricsEnabled();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const rows = await db.metricDaily.groupBy({ by: ["key"], where: { event: "reel_depth", day: { gte: since } }, _sum: { count: true } });
  const counts = new Map(rows.map((r) => [r.key, r._sum.count ?? 0]));
  const [esq, dir] = await Promise.all([getSideReel("esquerda"), getSideReel("direita")]);

  const funnels = [
    { id: "esquerda", title: "Reel da esquerda", keys: esq?.slides.map((s) => s.key) ?? [] },
    { id: "direita", title: "Reel da direita", keys: dir?.slides.map((s) => s.key) ?? [] },
    { id: "segundo-turno", title: "Propostas do 2º turno (por tema, sem candidatura)", keys: ["cover", ...ROUNDS.map((r) => `r-${r.slug}`), "end"] },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl tracking-tight">Medição agregada</h1>
      <p className="mt-3 text-paper/80">
        Estado: <strong>{on ? "ATIVADA" : "desativada"}</strong>. Cada número é a quantidade de visitas em que aquela foi a <em>última</em> tela vista do reel nos últimos 30
        dias (retenção: {RETENTION_DAYS} dias). Sem identificadores, sem cookies. Valores abaixo de {MIN_DISPLAY_COUNT} aparecem como “&lt;{MIN_DISPLAY_COUNT}”.
      </p>
      <p className="mt-2 text-sm text-ev-critique">
        Uso interno. Não divulgue estes números nem os apresente como preferência do eleitorado: em período de campanha, isso pode ser confundido com enquete eleitoral
        (proibida) ou pesquisa sem registro.
      </p>
      {!on && (
        <p className="mt-4 card p-4 text-sm">
          Para ativar: parecer jurídico → <code>AGGREGATE_METRICS_ENABLED=true</code> no servidor → chave em <Link className="underline" href="/admin/funcionalidades">Funcionalidades condicionais</Link> → atualizar a política de privacidade.
        </p>
      )}
      {funnels.map((f) => {
        const vals = f.keys.map((k) => ({ k, n: counts.get(`${f.id}:${k}`) ?? 0 }));
        const total = vals.reduce((a, v) => a + v.n, 0);
        const max = Math.max(1, ...vals.map((v) => v.n));
        return (
          <section key={f.id} className="mt-10">
            <h2 className="font-display text-xl">{f.title}</h2>
            <p className="font-mono text-xs text-ash">Total de visitas medidas: {total < MIN_DISPLAY_COUNT ? `<${MIN_DISPLAY_COUNT}` : total}</p>
            <ol className="mt-3 space-y-1">
              {vals.map((v, i) => (
                <li key={v.k} className="grid grid-cols-[2.5rem_1fr_4rem] items-center gap-3 text-xs">
                  <span className="font-mono text-ash">{i + 1}</span>
                  <span className="relative h-5 overflow-hidden bg-graphite-3">
                    <span className="absolute inset-y-0 left-0 bg-paper/30" style={{ width: v.n >= MIN_DISPLAY_COUNT ? `${(v.n / max) * 100}%` : 0 }} />
                    <span className="relative px-2 leading-5">{v.k}</span>
                  </span>
                  <span className="text-right font-mono">{v.n === 0 ? "0" : v.n < MIN_DISPLAY_COUNT ? `<${MIN_DISPLAY_COUNT}` : v.n}</span>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
