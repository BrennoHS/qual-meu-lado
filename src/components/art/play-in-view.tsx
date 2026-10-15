"use client";

import { Fragment, useRef } from "react";
import { useInView } from "motion/react";

/**
 * As ilustrações animam ao aparecer no DOM (assim funcionam no reel, inclusive
 * no Safari do iPhone, que não avisa a visibilidade dentro do reel). Em páginas
 * longas de rolagem normal, este invólucro guarda o espaço e só "dá o play"
 * (remonta o desenho) quando ele entra na tela.
 */
export function PlayInView({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className={className}>
      {seen ? (
        <Fragment key="play">{children}</Fragment>
      ) : (
        <div aria-hidden className="invisible">
          {children}
        </div>
      )}
    </div>
  );
}
