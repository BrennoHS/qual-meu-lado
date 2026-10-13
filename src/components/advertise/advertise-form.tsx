"use client";

import { useActionState, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as m from "motion/react-m";
import { CircleCheck, Send, X } from "lucide-react";
import { submitAdvertise, type AdvertiseState } from "@/app/anuncie/actions";
import { INTERESTS, type Interest } from "@/lib/advertise";

const initial: AdvertiseState = { ok: false, message: "" };
const field =
  "h-12 w-full border border-line bg-graphite-2 px-4 text-paper placeholder:text-ash focus:border-paper focus:outline-none aria-[invalid=true]:border-ev-critique";

/** Formulário de anúncio/apoio: envia direto para o e-mail de contato do projeto. */
export function AdvertiseForm({ defaultInterest = "anuncio", onDone }: { defaultInterest?: Interest; onDone?: () => void }) {
  const [state, action, pending] = useActionState(submitAdvertise, initial);
  const [interest, setInterest] = useState<Interest>(defaultInterest);
  const err = (k: string) => state.errors?.[k];

  if (state.ok) {
    return (
      <m.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} role="status" className="flex flex-col items-start gap-4 border border-paper/25 bg-graphite-2 p-6">
        <CircleCheck aria-hidden className="h-8 w-8 text-ev-pro" />
        <p className="font-display text-2xl">Mensagem enviada!</p>
        <p className="text-paper/80">A equipe vai responder no e-mail que você informou.</p>
        {onDone && (
          <button type="button" onClick={onDone} className="btn">
            Fechar
          </button>
        )}
      </m.div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <fieldset>
        <legend className="kicker mb-2">Assunto</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(INTERESTS) as Interest[]).map((k) => (
            <label key={k} className={`chip cursor-pointer ${interest === k ? "!border-paper !bg-paper !text-graphite" : ""}`}>
              <input type="radio" name="interest" value={k} checked={interest === k} onChange={() => setInterest(k)} className="sr-only" />
              {INTERESTS[k]}
            </label>
          ))}
        </div>
        {err("interest") && <p className="mt-1 text-sm text-ev-critique">{err("interest")}</p>}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ad-name" className="kicker mb-2 block">Seu nome *</label>
          <input id="ad-name" name="name" autoComplete="name" required aria-invalid={!!err("name")} className={field} />
          {err("name") && <p className="mt-1 text-sm text-ev-critique">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="ad-org" className="kicker mb-2 block">Empresa ou organização</label>
          <input id="ad-org" name="org" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="ad-email" className="kicker mb-2 block">E-mail *</label>
          <input id="ad-email" name="email" type="email" autoComplete="email" required aria-invalid={!!err("email")} className={field} />
          {err("email") && <p className="mt-1 text-sm text-ev-critique">{err("email")}</p>}
        </div>
        <div>
          <label htmlFor="ad-phone" className="kicker mb-2 block">Telefone / WhatsApp</label>
          <input id="ad-phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="ad-message" className="kicker mb-2 block">Mensagem *</label>
        <textarea
          id="ad-message"
          name="message"
          rows={5}
          required
          placeholder="Conte o que você tem em mente: formato, período, público…"
          aria-invalid={!!err("message")}
          className={`${field} h-auto py-3`}
        />
        {err("message") && <p className="mt-1 text-sm text-ev-critique">{err("message")}</p>}
      </div>

      <label className="flex items-start gap-3 text-sm text-paper/80">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[var(--color-paper)]" aria-invalid={!!err("consent")} />
        <span>
          Autorizo o DOIS LADOS a usar estes dados apenas para responder a este contato.{" "}
          <span className="text-ash">Partidos, candidaturas e governos em campanha não podem anunciar.</span>
        </span>
      </label>
      {err("consent") && <p className="-mt-3 text-sm text-ev-critique">{err("consent")}</p>}

      <div aria-hidden className="hidden">
        <label>
          Não preencha
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.message && !state.ok && <p role="alert" className="text-sm text-ev-critique">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn btn-solid disabled:opacity-60">
        <Send aria-hidden className="h-4 w-4" /> {pending ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}

/** Botão que abre o formulário numa janela — direto, sem trocar de página. */
export function AdvertiseDialog({ children, className = "btn", defaultInterest }: { children: React.ReactNode; className?: string; defaultInterest?: Interest }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[71] max-h-[92svh] overflow-y-auto border-t border-line bg-graphite p-5 focus:outline-none md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(40rem,calc(100vw-2rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:border md:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-2xl tracking-tight">Anuncie ou apoie o DOIS LADOS</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-paper/75">Sua mensagem vai direto para a equipe. Respondemos no seu e-mail.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Fechar" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-paper hover:border-paper">
              <X aria-hidden className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <AdvertiseForm defaultInterest={defaultInterest} onDone={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
