import Link from "next/link";
import { db } from "@/lib/db";
import { getPerspectives, getSettings } from "@/lib/content/queries";
import { SplitHero } from "@/components/hero/split-hero";
import { JourneySteps } from "@/components/site/journey-steps";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { EvidenceBadge } from "@/components/evidence/evidence-badge";
import { Reveal } from "@/components/ui/reveal";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import { getCurrentElection } from "@/lib/content/queries";
import { Countdown } from "./segundo-turno/countdown";
import { Congress } from "@/components/art/illustrations";
import { orderForHome } from "@/lib/election";
import type { EvidenceKind } from "@/lib/labels";

export const revalidate = 300;

/** "Para ir além" — o caminho principal (4 passos) fica em <JourneySteps />. */
const PATHS = [
  { href: "/temas", n: "01", title: "Conflitos de valores", text: "Liberdade, igualdade, segurança, responsabilidade fiscal: onde valores desejáveis entram em tensão." },
  { href: "/linha-do-tempo", n: "02", title: "Linha do tempo viva", text: "De 1789 a hoje, no Brasil e no mundo. Cada evento com sua fonte." },
  { href: "/mitos", n: "03", title: "Mitos e realidades", text: "Afirmações comuns sobre política. Você consegue dizer o que é fato?" },
  { href: "/fontes", n: "04", title: "Biblioteca de fontes", text: "Toda afirmação relevante tem origem, data e contexto." },
];

const LABELS: EvidenceKind[] = ["fact", "pro", "critique", "interpretation", "proposal", "unconfirmed"];

export default async function Home() {
  const [{ hero }, perspectives, sourceCount, claimCount, election] = await Promise.all([
    getSettings(),
    getPerspectives(),
    db.source.count({ where: { status: { in: PUBLIC_STATUSES }, isDemo: false } }),
    db.claim.count({ where: { status: { in: PUBLIC_STATUSES } } }),
    getCurrentElection(),
  ]);
  const finalists = election?.candidates ?? [];
  const left = perspectives.find((p) => p.side === "LEFT");
  const right = perspectives.find((p) => p.side === "RIGHT");

  return (
    <>
      <SiteHeader overlay />
      <main id="conteudo">
        <SplitHero
          question={hero.question}
          subtitle={hero.subtitle}
          left={{ href: "/explorar/esquerda", name: left?.name ?? "Esquerda", tagline: left?.tagline ?? "", description: left?.heroDescription ?? "" }}
          right={{ href: "/explorar/direita", name: right?.name ?? "Direita", tagline: right?.tagline ?? "", description: right?.heroDescription ?? "" }}
          candidates={orderForHome(finalists).map((c) => ({ slug: c.slug, ballotName: c.ballotName, number: c.number, partyAcronym: c.partyAcronym, runningMate: c.runningMate }))}
        />

        <section id="caminho" aria-labelledby="caminho-titulo" className="scroll-mt-4 border-b border-line">
          <div className="wrap py-14 md:py-20">
            <p className="kicker">Como funciona</p>
            <h2 id="caminho-titulo" className="h-section mt-3">Seu caminho em 4 passos</h2>
            <p className="mt-3 max-w-2xl text-paper/75">
              Comece por qualquer lado. O site lembra — só no seu navegador — o que você já viu e mostra o próximo passo.
            </p>
            <div className="mt-8">
              <JourneySteps />
            </div>
          </div>
        </section>

        {finalists.length >= 2 && (
          <section aria-labelledby="eleicao" className="border-b border-line bg-graphite-2">
            <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr] md:items-center md:py-20">
              <div>
                <p className="kicker text-ev-pro">Eleições 2026 · 2º turno em 25 de outubro</p>
                <h2 id="eleicao" className="display mt-4 text-[clamp(2.2rem,6.5vw,5rem)]">
                  {orderForHome(finalists).map((c) => c.ballotName).join(" × ")}
                </h2>
                <p className="mt-5 max-w-xl text-lg text-paper/80">
                  Veja as propostas de cada um, tema por tema, com o trecho exato do plano registrado no TSE. Sem torcida, sem ranking, sem recomendação de voto.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/?ver=propostas" className="btn btn-solid">Ver as propostas de cada um →</Link>
                  <Link href="/segundo-turno" className="btn">Comparar lado a lado</Link>
                  <Link href="/afinidades" className="btn btn-ghost">Antes, descobrir minhas afinidades</Link>
                </div>
              </div>
              <div className="space-y-8">
                <Countdown />
                <div className="hidden opacity-80 md:block">
                  <Congress />
                </div>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="proposta" className="wrap py-20 md:py-32">
          <Reveal>
            <p className="kicker">Dois lados. Milhões de perspectivas.</p>
            <h2 id="proposta" className="display mt-4 max-w-5xl text-[clamp(2.2rem,6.5vw,5.5rem)]">
              Esquerda ou direita? A pergunta é simples. A resposta, quase nunca.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80">
              Este não é um quiz que diz quem você é, nem uma enquete. É um especial para entender o que cada campo defende, por que defende, o que seus críticos
              dizem — e de onde vem cada informação. A conclusão é sua.
            </p>
          </Reveal>

          <p className="kicker mt-16">Para ir além</p>
          <ul className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((p, i) => (
              <li key={p.href} className="bg-graphite">
                <Reveal delay={i * 0.05} className="h-full">
                  <Link href={p.href} className="group flex h-full min-h-56 flex-col justify-between p-6 transition-colors hover:bg-graphite-2 md:p-8">
                    <span className="font-mono text-sm text-ash">{p.n}</span>
                    <span>
                      <span className="block font-display text-2xl tracking-tight group-hover:underline md:text-3xl">{p.title}</span>
                      <span className="mt-3 block text-paper/70">{p.text}</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="como-sabemos" className="border-y border-line bg-graphite-2">
          <div className="wrap grid gap-12 py-20 md:grid-cols-[1fr_1.2fr] md:py-28">
            <Reveal>
              <p className="kicker">Como sabemos o que sabemos</p>
              <h2 id="como-sabemos" className="h-section mt-3">Cada afirmação diz o que ela é.</h2>
              <p className="mt-5 max-w-md text-paper/75">
                Fato não é opinião, e argumento não é prova. Por isso cada conteúdo relevante tem uma etiqueta e um botão <strong>Ver fonte</strong>, com origem,
                data, contexto e limitações.
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-6">
                <div>
                  <dt className="kicker">Fontes catalogadas</dt>
                  <dd className="mt-1 font-display text-6xl font-bold tracking-tight">{sourceCount}</dd>
                </div>
                <div>
                  <dt className="kicker">Afirmações verificáveis</dt>
                  <dd className="mt-1 font-display text-6xl font-bold tracking-tight">{claimCount}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-4">
                {LABELS.map((k) => (
                  <li key={k} className="flex items-center justify-between gap-4 border-b border-line pb-4">
                    <EvidenceBadge kind={k} />
                    <span className="text-right text-sm text-ash">
                      {
                        {
                          fact: "Verificável em fonte primária ou de referência",
                          pro: "Como defensores justificam uma posição",
                          critique: "Objeção sustentada por evidência ou literatura",
                          interpretation: "Leitura de especialistas; pode haver outras",
                          proposal: "Promessa ou plano, não política implementada",
                          unconfirmed: "Em apuração — nunca exibida como fato",
                        }[k as Exclude<EvidenceKind, "prediction" | "opinion">]
                      }
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/como-construimos" className="kicker link-u mt-8 inline-block text-paper">Como construímos este site →</Link>
            </Reveal>
          </div>
        </section>

        <section className="wrap py-24 text-center md:py-36">
          <Reveal>
            <p className="display mx-auto max-w-5xl text-[clamp(2rem,6vw,5rem)]">{hero.finalPhrase}</p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link href="/explorar/esquerda" className="btn" data-side="esquerda">Explorar a esquerda</Link>
              <Link href="/afinidades" className="btn btn-afinidade">Descobrir minha afinidade</Link>
              <Link href="/explorar/direita" className="btn" data-side="direita">Explorar a direita</Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
