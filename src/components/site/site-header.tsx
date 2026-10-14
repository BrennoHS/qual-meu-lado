"use client";

import { X } from "lucide-react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ElectionPill, ReadingProgress } from "./hud";
import { JourneySteps } from "./journey-steps";
import { ArrowRight } from "lucide-react";

/** "Para ir além": tudo que não é um dos 4 passos do caminho (esses ficam em JourneySteps). */
export const NAV = [
  { href: "/temas", label: "Esquerda e direita, tema por tema" },
  { href: "/glossario", label: "Glossário" },
  { href: "/linha-do-tempo", label: "Linha do tempo" },
  { href: "/mitos", label: "Mitos e realidades" },
  { href: "/fontes", label: "Biblioteca de fontes" },
  { href: "/sua-escolha", label: "Dizer com minhas palavras" },
  { href: "/meu-percurso", label: "Seu percurso (e apagar dados)" },
  { href: "/como-funciona", label: "Como funciona o site" },
  { href: "/anuncie", label: "Anuncie no DOIS LADOS" },
];

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="DOIS LADOS — início">
      <span aria-hidden className="inline-flex h-4 w-4 overflow-hidden rounded-full ring-1 ring-paper/60">
        <span className="h-full w-1/2 bg-esq" />
        <span className="h-full w-1/2 bg-dir" />
      </span>
      <span className="whitespace-nowrap font-display text-[0.95rem] font-bold tracking-[0.08em]">DOIS LADOS</span>
    </Link>
  );
}

export function SiteHeader({ overlay = false, progress = true, children }: { overlay?: boolean; progress?: boolean; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className={`${overlay ? "absolute" : "sticky border-b border-line bg-graphite/85 backdrop-blur-md"} inset-x-0 top-0 z-40`}>
      <div className="wrap flex h-14 items-center justify-between gap-3">
        <Brand />
        <div className="flex min-w-0 items-center gap-2">
          {children}
          {pathname === "/" ? (
            <Link
              href="#caminho"
              className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border border-paper/35 px-2.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              <span aria-hidden className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[0.5rem]">?</span>
              Como funciona
            </Link>
          ) : pathname !== "/segundo-turno" && (
            <>
              <span className="hidden sm:inline-flex">
                <ElectionPill />
              </span>
              <span className="inline-flex sm:hidden">
                <ElectionPill compact />
              </span>
            </>
          )}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="kicker flex h-11 items-center gap-2 px-2 text-paper hover:text-paper">
              <span>Menu</span>
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-paper" />
                <span className="h-px w-full bg-paper" />
              </span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-line bg-graphite p-[var(--gutter)] focus:outline-none">
                <div className="flex h-14 items-center justify-between">
                  <Dialog.Title className="kicker">Navegação</Dialog.Title>
                  <Dialog.Close className="kicker h-11 px-2 text-paper">Fechar <X aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Seções do site DOIS LADOS</Dialog.Description>
                <nav aria-label="Principal" className="mt-2">
                  <p className="kicker mb-3">O caminho</p>
                  <JourneySteps compact onNavigate={() => setOpen(false)} />
                  <p className="kicker mb-1 mt-8">Para ir além</p>
                  <ul className="divide-y divide-line border-y border-line">
                    {NAV.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className="flex min-h-12 items-center justify-between py-2.5 font-display text-lg tracking-tight hover:text-paper aria-[current=page]:underline"
                        >
                          {item.label}
                          <ArrowRight aria-hidden className="h-4 w-4 text-ash" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <p className="mt-auto pt-8 text-sm text-ash">Suas respostas ficam apenas neste navegador.</p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      {!overlay && progress && <ReadingProgress />}
    </header>
  );
}
