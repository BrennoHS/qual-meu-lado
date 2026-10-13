"use client";

import { ArrowLeftRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { TLink, useTransitionNav, type Tone } from "@/components/transition/transition-provider";
import { markVisited } from "@/lib/journey/store";

type Link = { href: string; label: string; kicker: string; number: number };
type Counterpart = { title: string; kicker: string; keyPoints: string[]; summary: string; sideSlug: string; sideName: string } | null;

/**
 * Barra fixa no rodapé da tela durante a leitura: "Próximo" sempre visível
 * (e pulsando quando a leitura chega ao fim), atalho para ver o mesmo
 * capítulo pelo outro lado e o capítulo anterior.
 */
export function ChapterDock({
  side,
  chapterSlug,
  next,
  prev,
  counterpart,
}: {
  side: "esquerda" | "direita";
  chapterSlug: string;
  next: Link | null;
  prev: Link | null;
  counterpart: Counterpart;
}) {
  const { scrollYProgress } = useScroll();
  const [shown, setShown] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShown(v > 0.04);
    setNearEnd(v > 0.82);
  });
  useEffect(() => markVisited(side, chapterSlug), [side, chapterSlug]);

  const tone: Tone = side;
  const otherTone: Tone = side === "esquerda" ? "direita" : "esquerda";

  return (
    <m.div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-graphite/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      initial={false}
      animate={{ y: shown ? 0 : "110%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="wrap flex h-[4.25rem] items-center gap-2">
        {prev ? (
          <TLink
            href={prev.href}
            scene={{ label: prev.kicker, sub: `Capítulo ${prev.number}`, tone, number: String(prev.number), from: "right" }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-lg hover:border-paper"
            aria-label={`Capítulo anterior: ${prev.label}`}
          >
            ←
          </TLink>
        ) : (
          <span className="h-12 w-12 shrink-0" />
        )}

        {counterpart && <OtherSideButton side={side} chapterSlug={chapterSlug} counterpart={counterpart} otherTone={otherTone} />}

        {next ? (
          <TLink
            href={next.href}
            scene={{ label: next.kicker, sub: `Capítulo ${next.number} · ${next.label}`, tone, number: String(next.number) }}
            className="group relative ml-auto flex h-12 min-w-0 items-center gap-3 overflow-hidden rounded-full bg-paper pl-5 pr-2 text-graphite shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
          >
            {nearEnd && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-paper/40" />}
            <span className="relative min-w-0 truncate">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] opacity-70">Próximo · </span>
              <span className="font-display font-semibold">{next.kicker}</span>
            </span>
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-graphite text-paper transition-transform group-hover:translate-x-0.5">→</span>
          </TLink>
        ) : (
          <TLink
            href={`/explorar/${side === "esquerda" ? "direita" : "esquerda"}`}
            scene={{ label: side === "esquerda" ? "Direita" : "Esquerda", sub: "Agora o outro lado", tone: otherTone, from: side === "esquerda" ? "right" : "left" }}
            className="ml-auto flex h-12 items-center gap-3 rounded-full bg-paper pl-5 pr-2 text-graphite"
          >
            <span className="font-display font-semibold">Ver o outro lado</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-graphite text-paper"><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span>
          </TLink>
        )}
      </div>
    </m.div>
  );
}

function OtherSideButton({ side, chapterSlug, counterpart, otherTone }: { side: string; chapterSlug: string; counterpart: NonNullable<Counterpart>; otherTone: Tone }) {
  const { go } = useTransitionNav();
  const [open, setOpen] = useState(false);
  const fromRight = side === "esquerda";
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="flex h-12 items-center gap-2 rounded-full border border-line px-4 text-sm hover:border-paper"
        data-side={counterpart.sideSlug}
      >
        <span aria-hidden className="text-[var(--accent-ink)]"><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span>
        <span className="hidden sm:inline">Como a {counterpart.sideName.toLowerCase()} vê isso</span>
        <span className="sm:hidden">Outro lado</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]" />
        <Dialog.Content
          data-side={counterpart.sideSlug}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto border-t-2 border-[var(--accent)] bg-graphite-2 p-[var(--gutter)] pb-10 focus:outline-none md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[640px] md:-translate-x-1/2 md:border-2"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="kicker text-[var(--accent-ink)]">Mesmo capítulo, pela {counterpart.sideName.toLowerCase()}</p>
            <Dialog.Close className="kicker -mr-2 -mt-2 h-11 px-2">Fechar <X aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></Dialog.Close>
          </div>
          <Dialog.Title className="mt-3 font-display text-3xl tracking-tight">{counterpart.title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-paper/75">{counterpart.summary}</Dialog.Description>
          <p className="kicker mt-6">Em 30 segundos</p>
          <ol className="mt-3 space-y-3">
            {counterpart.keyPoints.map((k, i) => (
              <m.li key={i} className="flex gap-3 leading-snug" initial={{ opacity: 0, x: fromRight ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                <span className="font-mono text-[var(--accent-ink)]">{i + 1}</span>
                <span>{k}</span>
              </m.li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => {
                setOpen(false);
                go(`/explorar/${counterpart.sideSlug}/${chapterSlug}`, { label: counterpart.sideName, sub: counterpart.kicker, tone: otherTone, from: fromRight ? "right" : "left" });
              }}
            >
              Ler este capítulo pela {counterpart.sideName.toLowerCase()} →
            </button>
            <Dialog.Close className="btn btn-ghost">Continuar aqui</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
