"use client";

import { Check } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { haptic } from "@/lib/haptics";

/** Palavra difícil: sublinhado pontilhado; um toque mostra o significado em uma frase. */
export function GlossTerm({ term, definition, children }: { term: string; definition: string; children: React.ReactNode }) {
  return (
    <Popover.Root onOpenChange={(o) => o && haptic("tick")}>
      <Popover.Trigger asChild>
        <button type="button" className="gloss" aria-label={`${typeof children === "string" ? children : term}: ver o significado`}>
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          className="gloss-pop z-[80] w-[min(20rem,calc(100vw-24px))] border border-paper/25 bg-graphite-3 p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
        >
          <p className="kicker text-paper">{term}</p>
          <p className="mt-1.5 font-sans text-[0.95rem] font-normal normal-case leading-snug tracking-normal text-paper/90">{definition}</p>
          <Popover.Close className="kicker mt-3 text-ash hover:text-paper">Entendi <Check aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></Popover.Close>
          <Popover.Arrow className="fill-graphite-3" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
