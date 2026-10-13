"use client";

import { useActionState } from "react";
import { submitReport, type ReportState } from "./actions";

const initial: ReportState = { ok: false, message: "" };

export function ReportForm({ refKey }: { refKey?: string }) {
  const [state, action, pending] = useActionState(submitReport, initial);
  if (state.ok) {
    return <p role="status" className="border border-line p-6 text-lg">{state.message}</p>;
  }
  const field = "h-12 w-full border border-line bg-graphite-2 px-4 text-paper placeholder:text-ash focus:border-paper focus:outline-none aria-[invalid=true]:border-ev-critique";
  return (
    <form action={action} className="space-y-6" noValidate>
      <div>
        <label htmlFor="pageUrl" className="kicker mb-2 block">Página ou identificador (opcional)</label>
        <input id="pageUrl" name="pageUrl" defaultValue={refKey ?? ""} className={field} placeholder="ex.: /explorar/direita/criticas" />
      </div>
      <div>
        <label htmlFor="message" className="kicker mb-2 block">O que está errado ou desatualizado? *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "message-err" : undefined}
          className={`${field} h-auto py-3`}
        />
        {state.errors?.message && <p id="message-err" className="mt-1 text-sm text-ev-critique">{state.errors.message}</p>}
      </div>
      <div>
        <label htmlFor="contactEmail" className="kicker mb-2 block">E-mail para resposta (opcional)</label>
        <input id="contactEmail" name="contactEmail" type="email" autoComplete="email" aria-invalid={!!state.errors?.contactEmail} className={field} />
        {state.errors?.contactEmail && <p className="mt-1 text-sm text-ev-critique">{state.errors.contactEmail}</p>}
        <p className="mt-1 text-xs text-ash">Usado apenas para responder a este relato. Não registramos seu IP.</p>
      </div>
      <div aria-hidden className="hidden">
        <label>Não preencha<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.message && <p role="alert" className="text-sm text-ev-critique">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn btn-solid disabled:opacity-60">{pending ? "Enviando…" : "Enviar relato"}</button>
    </form>
  );
}
