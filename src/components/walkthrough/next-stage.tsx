"use client";

import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import * as m from "motion/react-m";
import { TLink, type Tone } from "@/components/transition/transition-provider";
import { useJourney } from "@/lib/journey/store";
import { Crossroads } from "@/components/art/illustrations";

/** Final do capítulo: um "palco" grande que empurra para o próximo passo. */
export function NextStage({ side, next }: { side: "esquerda" | "direita"; next: { href: string; number: number; kicker: string; title: string } }) {
  return (
    <section aria-label="Próximo capítulo" className="relative overflow-hidden border-t border-line">
      <TLink
        href={next.href}
        scene={{ label: next.kicker, sub: `Capítulo ${next.number} · ${next.title}`, tone: side, number: String(next.number) }}
        className="group block"
      >
        <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(70% 90% at 80% 50%, var(--accent-deep), transparent 70%)" }} />
        <div className="wrap relative grid items-end gap-6 py-16 md:grid-cols-[auto_1fr_auto] md:py-24">
          <m.span
            aria-hidden
            className="display text-[clamp(6rem,22vw,16rem)] leading-[0.8] text-transparent"
            style={{ WebkitTextStroke: "1.5px var(--accent-ink)" }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {String(next.number).padStart(2, "0")}
          </m.span>
          <div>
            <p className="kicker text-[var(--accent-ink)]">Continue · {next.kicker}</p>
            <p className="display mt-3 text-[clamp(2rem,6vw,4.5rem)] group-hover:underline">{next.title}</p>
          </div>
          <span className="grid h-20 w-20 place-items-center rounded-full bg-paper text-3xl text-graphite transition-transform duration-300 group-hover:translate-x-2">→</span>
        </div>
      </TLink>
    </section>
  );
}

/** Fim da jornada de um lado: o empurrão é para o OUTRO lado — nunca prender o visitante. */
export function JourneyEnd({ side }: { side: "esquerda" | "direita" }) {
  const { visited } = useJourney();
  const other = side === "esquerda" ? "direita" : "esquerda";
  const otherName = other === "esquerda" ? "Esquerda" : "Direita";
  const sawOther = visited.filter((v) => v.side === other).length;
  const otherTone: Tone = other;
  return (
    <section aria-labelledby="fim" className="border-t border-line">
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:items-center md:py-24">
        <div className="max-w-md">
          <Crossroads />
        </div>
        <div>
          <p className="kicker">Você chegou ao fim da {side}</p>
          <h2 id="fim" className="display mt-3 text-[clamp(2.2rem,6vw,4.8rem)]">{sawOther >= 7 ? "Você viu os dois lados." : "Agora, o outro lado."}</h2>
          <p className="mt-5 max-w-lg text-lg text-paper/80">
            {sawOther >= 7
              ? "Você já percorreu as duas jornadas. Agora descubra com que lado suas ideias combinam mais — e depois compare as propostas do 2º turno."
              : "Ninguém escolhe bem conhecendo um lado só. Veja como a " + other + " responde às mesmas perguntas — leva poucos minutos."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-side={other}>
            {sawOther < 7 && (
              <TLink href={`/explorar/${other}`} scene={{ label: otherName, sub: "Agora o outro lado", tone: otherTone, from: side === "esquerda" ? "right" : "left" }} className="btn btn-solid">
                Explorar a {other} <ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} />
              </TLink>
            )}
            <Link href="/afinidades" className="btn btn-afinidade">Descobrir minha afinidade</Link>
            <Link href="/segundo-turno" className="btn btn-ghost">Comparar propostas do 2º turno</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
