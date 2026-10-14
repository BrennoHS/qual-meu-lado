"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { haptic } from "@/lib/haptics";

/**
 * Compartilhar uma tela do reel. No celular abre a folha nativa (WhatsApp etc.);
 * no computador mostra WhatsApp e "copiar link". O link leva a uma imagem de
 * prévia com OS DOIS LADOS juntos — nunca respostas ou escolhas pessoais.
 */
export function ShareChip({ path, title, text, label = "Compartilhar", className = "", iconOnlyOnMobile = false, iconOnly = false }: { path: string; title: string; text: string; label?: string; className?: string; iconOnlyOnMobile?: boolean; iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = () => new URL(path, window.location.origin).toString();

  async function onClick(e: React.MouseEvent) {
    haptic("tap");
    if (typeof navigator !== "undefined" && navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      e.preventDefault();
      try {
        await navigator.share({ title, text, url: url() });
      } catch {
        /* cancelado */
      }
      return;
    }
    // no computador, o próprio Popover abre (não chamamos preventDefault)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem permissão */
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" onClick={onClick} aria-label={iconOnlyOnMobile || iconOnly ? label : undefined} className={`inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-paper/85 hover:text-paper ${className}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {iconOnly ? null : iconOnlyOnMobile ? <span className="hidden md:inline">{label}</span> : label}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" sideOffset={8} collisionPadding={12} className="gloss-pop z-[80] w-64 border border-paper/25 bg-graphite-3 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${typeof window !== "undefined" ? url() : ""}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center gap-3 px-3 text-sm hover:bg-paper/10"
          >
            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-[#25d366] text-[0.7rem] font-bold text-graphite">W</span>
            Enviar no WhatsApp
          </a>
          <button type="button" onClick={copy} className="flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm hover:bg-paper/10" aria-live="polite">
            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full border border-paper/40 text-[0.7rem]"><Copy aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span>
            {copied ? <>Link copiado <Check aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></> : "Copiar link"}
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
