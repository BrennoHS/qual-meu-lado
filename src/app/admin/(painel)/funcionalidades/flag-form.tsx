"use client";

import { useActionState } from "react";
import { setFeatureFlag, type ActionState } from "../../actions";

export function FlagForm({ flagKey, enabled, legalReviewRef }: { flagKey: string; enabled: boolean; legalReviewRef: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(setFeatureFlag.bind(null, flagKey), { ok: false, message: "" });
  return (
    <form action={action} className="mt-4 space-y-3 border-t border-line pt-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="enabled" defaultChecked={enabled} className="h-5 w-5" /> Ativar
      </label>
      <label className="block">
        <span className="kicker mb-1 block">Referência do parecer jurídico</span>
        <input name="legalReviewRef" defaultValue={legalReviewRef} className="h-11 w-full border border-line bg-graphite-2 px-3" placeholder="Nº/protocolo, autoria e data" />
      </label>
      {state.message && <p role="status" className={`text-sm ${state.ok ? "text-ev-pro" : "text-ev-critique"}`}>{state.message}</p>}
      <button disabled={pending} className="btn btn-ghost">Salvar</button>
    </form>
  );
}
