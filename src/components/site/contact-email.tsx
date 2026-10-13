"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

/** Mostra o e-mail só quando a pessoa pede (o endereço não aparece inteiro no HTML). */
export function ContactEmail({ user, domain, subject }: { user: string; domain: string; subject?: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = `${user}@${domain}`;
  if (!shown) {
    return (
      <button type="button" onClick={() => setShown(true)} className="btn btn-solid">
        <Mail aria-hidden className="h-4 w-4" /> Mostrar e-mail
      </button>
    );
  }
  return (
    <span className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`} className="btn btn-solid normal-case tracking-normal">
        <Mail aria-hidden className="h-4 w-4" /> {email}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            /* sem permissão */
          }
        }}
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper/80 hover:text-paper"
        aria-live="polite"
      >
        {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </span>
  );
}
