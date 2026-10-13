"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { daysUntil, SECOND_ROUND_DATE } from "@/lib/election";
import { BallotBox } from "@/components/art/illustrations";

/** Contagem regressiva para o 2º turno (calculada no navegador). */
export function Countdown() {
  const [days, setDays] = useState<number | null>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    const d = daysUntil(SECOND_ROUND_DATE);
    setDays(d);
    if (d > 0) {
      const controls = animate(count, d, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
      return () => controls.stop();
    }
  }, [count]);

  return (
    <div className="flex items-end gap-5 md:justify-end">
      <BallotBox className="h-20 w-20 text-paper/80 md:h-28 md:w-28" />
      <div>
        {days === null || days > 0 ? (
          <>
            <p className="kicker">Faltam</p>
            <p className="display text-[clamp(4rem,12vw,8rem)] leading-none">
              <m.span>{rounded}</m.span>
            </p>
            <p className="kicker">dias para votar · 25/10</p>
          </>
        ) : days === 0 ? (
          <p className="display text-5xl">É hoje.</p>
        ) : (
          <p className="kicker">2º turno realizado em 25/10/2026</p>
        )}
      </div>
    </div>
  );
}
