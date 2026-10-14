"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Número que conta de 0 até o valor quando aparece na tela. */
export function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  // no servidor (e sem JavaScript) mostra o número final; no navegador, zera até aparecer
  useEffect(() => {
    if (!reduce && !seen) setN(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!seen || reduce) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, reduce, value]);
  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}
