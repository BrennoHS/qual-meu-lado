"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useReadingMode } from "@/lib/journey/mode";

/**
 * Bloco da camada "aprofundada". No modo Essencial aparece recolhido, como
 * um convite discreto ("Aprofundar: …"); no modo Aprofundado, aberto e
 * sinalizado. O visitante pode abrir só o que quiser.
 */
export function DeepLayer({ title, children }: { title: string; children: React.ReactNode }) {
  const mode = useReadingMode();
  const [open, setOpen] = useState(false);
  const visible = mode === "aprofundado" || open;
  return (
    <section className="relative" aria-label={`Aprofundamento: ${title}`}>
      {!visible ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-4 border border-dashed border-line px-5 py-4 text-left transition-colors hover:border-paper/60 hover:bg-graphite-2"
        >
          <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg transition-transform group-hover:rotate-90">+</span>
          <span className="min-w-0">
            <span className="kicker block text-ash">Aprofundar</span>
            <span className="block truncate font-display text-lg">{title}</span>
          </span>
        </button>
      ) : (
        <AnimatePresence initial={false}>
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative my-8 border-l-2 border-dashed border-line py-2 pl-4 md:pl-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="kicker text-ash">⌄ Leitura aprofundada</span>
              {mode !== "aprofundado" && (
                <button type="button" onClick={() => setOpen(false)} className="kicker min-h-9 text-ash hover:text-paper">
                  Recolher
                </button>
              )}
            </div>
            {children}
          </m.div>
        </AnimatePresence>
      )}
    </section>
  );
}
