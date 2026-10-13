"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

/**
 * LazyMotion com domMax: inclui arrastar (deslizar rodadas) e animações de layout
 * (pílulas que correm entre opções, "Inverter lados").
 * reducedMotion="user" respeita prefers-reduced-motion em todo o site.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
