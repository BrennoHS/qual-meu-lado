"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { statusLabel, type Status } from "@/lib/editorial/status";
import { StatusBadge } from "./status-badge";

const verbs: Record<Status, string> = {
  DRAFT: "Voltar para rascunho",
  IN_REVIEW: "Enviar para revisão",
  VERIFIED: "Marcar como verificado",
  PUBLISHED: "Publicar",
  OUTDATED: "Marcar como desatualizado",
};

export function WorkflowPanel({
  status,
  allowed,
  issues,
  action,
}: {
  status: Status;
  allowed: Status[];
  issues: string[];
  action: (s: ActionState, f: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  const steps: Status[] = ["DRAFT", "IN_REVIEW", "VERIFIED", "PUBLISHED"];
  return (
    <section aria-labelledby="fluxo" className="card p-5">
      <h2 id="fluxo" className="kicker">Fluxo editorial</h2>
      <ol className="mt-3 flex flex-wrap items-center gap-1 font-mono text-[0.65rem] uppercase tracking-[0.08em]">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-1 ${s === status ? "text-paper" : "text-ash"}`}>
            <span className={s === status ? "underline underline-offset-4" : ""}>{statusLabel[s]}</span>
            {i < steps.length - 1 && <span aria-hidden>→</span>}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm">Estado atual: <StatusBadge status={status} /></p>

      {issues.length > 0 && (
        <div className="mt-4 border border-dashed border-ev-critique p-3 text-sm text-ev-critique">
          <p className="font-medium">Pendências para verificar/publicar:</p>
          <ul className="mt-1 list-disc pl-5">{issues.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      )}

      {allowed.length > 0 ? (
        <form action={formAction} className="mt-4 space-y-3">
          <label className="block">
            <span className="kicker mb-1 block">Nota (opcional)</span>
            <input name="note" className="h-10 w-full border border-line bg-graphite px-3 text-sm focus:border-paper focus:outline-none" />
          </label>
          <div className="flex flex-wrap gap-2">
            {allowed.map((to) => (
              <button key={to} type="submit" name="to" value={to} disabled={pending} className={`btn min-h-10 py-2 text-[0.7rem] ${to === "PUBLISHED" ? "btn-solid" : "btn-ghost"}`}>
                {verbs[to]}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ash">Seu papel não permite mudar o estado a partir daqui.</p>
      )}
      {state.message && (
        <div role="status" className={`mt-3 text-sm ${state.ok ? "text-ev-pro" : "text-ev-critique"}`}>
          {state.message}
          {state.issues && <ul className="mt-1 list-disc pl-5">{state.issues.map((i) => <li key={i}>{i}</li>)}</ul>}
        </div>
      )}
    </section>
  );
}
