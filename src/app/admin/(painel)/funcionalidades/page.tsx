import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { formatDate } from "@/lib/labels";
import { FlagForm } from "./flag-form";

export default async function FlagsPage() {
  const user = await requireUser();
  const flags = await db.featureFlag.findMany();
  const envFor = (key: string) => (key === "aggregate-metrics" ? ["AGGREGATE_METRICS_ENABLED", process.env.AGGREGATE_METRICS_ENABLED === "true"] : ["COLLECTIVE_RESULTS_ENABLED", process.env.COLLECTIVE_RESULTS_ENABLED === "true"]) as [string, boolean];
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl tracking-tight">Funcionalidades condicionais</h1>
      <p className="mt-3 text-paper/80">
        A arquitetura admite, no futuro, visualizações de participação coletiva. Elas ficam <strong>desligadas</strong> e só podem ser ativadas com: (1) parecer jurídico
        registrado; (2) variável de ambiente explícita no servidor; (3) metodologia que não configure enquete eleitoral nem confunda visitantes voluntários com amostra
        representativa. Hoje nenhuma resposta individual é coletada — não há o que agregar.
      </p>
      <ul className="mt-8 space-y-6">
        {flags.map((f) => (
          <li key={f.key} className="card p-5">
            <p className="font-mono text-xs text-ash">{f.key}</p>
            <p className="mt-1 text-lg">{f.enabled ? "ATIVADA" : "Desativada"}</p>
            <p className="mt-2 text-sm text-paper/80">{f.notes}</p>
            {f.legalReviewRef && (
              <p className="mt-2 font-mono text-xs">
                Parecer: {f.legalReviewRef} · {f.approvedBy} · {formatDate(f.approvedAt)}
              </p>
            )}
            <p className="mt-2 font-mono text-xs text-ash">Servidor: {envFor(f.key)[0]}={envFor(f.key)[1] ? "true" : "false"}</p>
            {user.role === "ADMIN" && <FlagForm flagKey={f.key} enabled={f.enabled} legalReviewRef={f.legalReviewRef ?? ""} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
