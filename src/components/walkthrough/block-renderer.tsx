import { ArrowLeftRight } from "lucide-react";
import { RichText } from "@/lib/richtext";
import { Gloss } from "@/lib/glossary";
import type { Block } from "@/lib/content/blocks";
import type { ChapterBundle } from "@/lib/content/queries";
import { ClaimCard } from "@/components/evidence/claim-card";
import { SourceButton } from "@/components/evidence/source-panel";
import { Reveal } from "@/components/ui/reveal";
import { Reflection } from "@/components/affinity/reflection";
import { TimelineView } from "./timeline-view";
import { CurrentsView } from "./currents-view";
import { AxesChart } from "./axes-chart";
import { ThemesExplorer } from "./themes-explorer";
import { ArgumentsList } from "./arguments-list";
import { Counterpoints } from "./counterpoints";
import { DeepLayer } from "./layered";
import { ExampleCard, Glossary, Pulse } from "./micro";
import { Illustration } from "@/components/art/illustrations";
import { PlayInView } from "@/components/art/play-in-view";

function SectionHead({ title, intro }: { title?: string; intro?: string }) {
  if (!title && !intro) return null;
  return (
    <header className="mb-6">
      {title && <h2 className="h-section">{title}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-paper/75">{intro}</p>}
    </header>
  );
}

const deepTitles: Partial<Record<Block["type"], string>> = {
  timeline: "Linha do tempo",
  currents: "As correntes do campo",
  axes: "Esquema: economia × costumes",
  claims: "Mais fatos com fonte",
  arguments: "Mais argumentos",
  counterpoints: "Mais confrontos",
  didYouKnow: "Você sabia?",
  valueConflict: "Conflito de valores",
  text: "Texto complementar",
};

/** Envolve blocos da camada aprofundada no convite/recolhimento. */
export function BlockRenderer({ block, bundle }: { block: Block; bundle: ChapterBundle }) {
  const inner = <BlockInner block={block} bundle={bundle} />;
  if (block.layer !== "deep") return inner;
  const title = ("title" in block && block.title) || deepTitles[block.type] || "Aprofundamento";
  return <DeepLayer title={title}>{inner}</DeepLayer>;
}

function BlockInner({ block, bundle }: { block: Block; bundle: ChapterBundle }) {
  const { claims } = bundle;
  const side = bundle.perspective.side;
  const otherName = side === "LEFT" ? "direita" : "esquerda";

  switch (block.type) {
    case "lead":
      return (
        <Reveal>
          <p className="lead max-w-3xl"><Gloss text={block.text} /></p>
        </Reveal>
      );
    case "text":
      return (
        <Reveal className="max-w-2xl">
          {block.title && <h2 className="h-section mb-5">{block.title}</h2>}
          <RichText text={block.body} gloss />
        </Reveal>
      );
    case "claims":
      return (
        <div className="grid gap-4">
          {block.title && <h2 className="h-section">{block.title}</h2>}
          {block.claimKeys.map((k) => (
            <Reveal key={k}>
              <ClaimCard claimKey={k} claim={claims[k]} />
            </Reveal>
          ))}
        </div>
      );
    case "timeline": {
      const events = bundle.timeline.map((e) => ({ ...e, scope: e.scope as "BRAZIL" | "INTERNATIONAL" }));
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <TimelineView events={events} claims={claims} initialTags={block.tags ?? []} initialScope={block.scope ?? "ALL"} />
        </section>
      );
    }
    case "currents": {
      const items = block.slugs.map((s) => bundle.currents.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c);
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <CurrentsView items={items} />
        </section>
      );
    }
    case "axes":
      return (
        <section className="max-w-3xl">
          <SectionHead title={block.title} intro={block.intro} />
          <AxesChart points={bundle.currents} highlight={block.highlightSlugs ?? []} />
        </section>
      );
    case "themes": {
      const items = bundle.themes.map((t) => {
        const p = t.positions.find((p) => p.side === side);
        return {
          slug: t.slug,
          name: t.name,
          description: t.description,
          position: p ? { summary: p.summary, points: p.points, nuances: p.nuances, claimKeys: p.claimKeys } : null,
        };
      });
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <ThemesExplorer themes={items} claims={claims} />
        </section>
      );
    }
    case "arguments":
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <ArgumentsList kind={block.kind} items={block.items} claims={claims} />
        </section>
      );
    case "counterpoints":
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <Counterpoints items={block.items} claims={claims} thisSideName={bundle.perspective.name.toLowerCase()} otherSideName={otherName} />
        </section>
      );
    case "reflection":
      return (
        <section>
          <SectionHead title={block.title} intro={block.intro} />
          <Reflection statements={block.statementKeys.map((k) => bundle.statements.find((s) => s.key === k)).filter((s): s is NonNullable<typeof s> => !!s)} />
        </section>
      );
    case "didYouKnow": {
      const c = bundle.curiosities[block.curiositySlug];
      if (!c) return null;
      return (
        <Reveal>
          <aside className="relative overflow-hidden border border-line bg-graphite-2 p-6 md:p-8" aria-label="Você sabia?">
            <span aria-hidden className="absolute -right-4 -top-8 font-display text-[9rem] font-bold leading-none text-[var(--accent)] opacity-20">?</span>
            <p className="kicker text-[var(--accent-ink)]">Você sabia?</p>
            <p className="relative mt-3 max-w-2xl font-display text-xl leading-snug md:text-2xl">{c.text}</p>
            {c.claimKey && <SourceButton claim={claims[c.claimKey]} className="relative mt-3" />}
          </aside>
        </Reveal>
      );
    }
    case "illustration":
      return (
        <Reveal>
          <figure className="mx-auto max-w-3xl">
            {block.title && <p className="kicker mb-4 text-center">{block.title}</p>}
            <PlayInView>
              <Illustration name={block.name} />
            </PlayInView>
            {block.caption && <figcaption className="mx-auto mt-4 max-w-xl text-center text-sm text-ash">{block.caption}</figcaption>}
          </figure>
        </Reveal>
      );
    case "glossary":
      return <Glossary title={block.title} items={block.items} />;
    case "pulse": {
      const st = bundle.statements.find((s) => s.key === block.statementKey);
      return st ? <Pulse statement={st} prompt={block.prompt} /> : null;
    }
    case "example":
      return (
        <Reveal>
          <ExampleCard title={block.title} body={<RichText text={block.body} gloss className="space-y-3" />} />
        </Reveal>
      );
    case "valueConflict":
      return (
        <Reveal>
          <section className="border-y border-line py-8" aria-label={`Conflito de valores: ${block.title}`}>
            <p className="kicker">Conflito de valores</p>
            <h2 className="h-section mt-2">{block.title}</h2>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
              <p className="border border-line p-4 text-center font-display text-lg md:text-2xl">{block.values[0]}</p>
              <span aria-hidden className="font-mono text-ash"><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span>
              <p className="border border-line p-4 text-center font-display text-lg md:text-2xl">{block.values[1]}</p>
            </div>
            <p className="mt-6 max-w-2xl"><span className="kicker mr-2">Situação</span>{block.scenario}</p>
            <p className="mt-3 max-w-2xl text-paper/80">{block.tension}</p>
          </section>
        </Reveal>
      );
  }
}
