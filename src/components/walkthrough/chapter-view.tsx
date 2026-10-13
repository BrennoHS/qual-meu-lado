import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterBundle } from "@/lib/content/queries";
import { RichText } from "@/lib/richtext";
import { BlockRenderer } from "./block-renderer";
import { ChapterHero } from "./chapter-hero";
import { ChapterDock } from "./chapter-dock";
import { DeepLayer } from "./layered";
import { JourneyEnd, NextStage } from "./next-stage";
import { ChapterProgress } from "./chapter-chrome";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SponsorSlot } from "@/components/site/sponsor-slot";
import { BalanceMeter } from "@/components/site/hud";
import { ShareButton } from "@/components/ui/share-button";
import { formatDate } from "@/lib/labels";

/** Capítulo da jornada. Usado em /explorar/[lado] (entrada direta) e /explorar/[lado]/[capitulo]. */
export async function ChapterView({ lado, capitulo, entry = false }: { lado: string; capitulo: string; entry?: boolean }) {
  if (lado !== "esquerda" && lado !== "direita") notFound();
  const bundle = await getChapterBundle(lado, capitulo);
  if (!bundle) notFound();
  const { perspective, chapters, chapter, counterpart } = bundle;
  const otherSide = lado === "esquerda" ? "direita" : "esquerda";
  const idx = chapters.findIndex((c) => c.slug === chapter.slug);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  // Agrupa blocos aprofundados consecutivos para que fiquem compactos na leitura essencial.
  const groups: { deep: boolean; items: { block: (typeof chapter.blocks)[number]; i: number }[] }[] = [];
  chapter.blocks.forEach((block, i) => {
    const deep = block.layer === "deep";
    const last = groups[groups.length - 1];
    if (last && last.deep === deep) last.items.push({ block, i });
    else groups.push({ deep, items: [{ block, i }] });
  });
  const firstDeep = groups.findIndex((g) => g.deep);
  const lastGroup = groups.length - 1;
  const toLink = (c: (typeof chapters)[number]) => ({ href: `/explorar/${lado}/${c.slug}`, label: c.title, kicker: c.kicker, number: c.number });

  return (
    <div data-side={lado} className="min-h-svh pb-24">
      <SiteHeader>
        <Link href={`/explorar/${lado}#${chapter.slug}-cover`} className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ash hover:text-paper lg:inline-flex" title="Voltar para o modo em telas curtas">
          <span aria-hidden>▶</span> Modo reel
        </Link>
        <ChapterProgress side={lado} otherSide={otherSide} otherName={otherSide} chapters={chapters} current={chapter.slug} />
        <BalanceMeter total={chapters.length} />
      </SiteHeader>

      <main id="conteudo">
        <ChapterHero
          sideName={perspective.name}
          number={chapter.number}
          total={chapters.length}
          kicker={chapter.kicker}
          title={chapter.title}
          summary={chapter.summary}
          keyPoints={chapter.keyPoints}
          entry={entry}
          outdated={chapter.status === "OUTDATED"}
        />

        <div className="wrap space-y-14 py-14 md:space-y-20 md:py-20">
          {groups.map((g, gi) =>
            g.deep ? (
              <section key={gi} aria-label="Leitura aprofundada" className="space-y-3">
                {gi === firstDeep && (
                  <p className="kicker flex items-center gap-3 text-ash">
                    <span className="h-px flex-1 bg-line" /> Quer ir mais fundo? <span className="h-px flex-1 bg-line" />
                  </p>
                )}
                {g.items.map(({ block, i }) => (
                  <BlockRenderer key={i} block={block} bundle={bundle} />
                ))}
                {gi === lastGroup && chapter.deepDive && (
                  <DeepLayer title="Para ir além: leituras e debates">
                    <RichText text={chapter.deepDive} className="rt max-w-2xl" />
                  </DeepLayer>
                )}
              </section>
            ) : (
              g.items.map(({ block, i }) => <BlockRenderer key={i} block={block} bundle={bundle} />)
            ),
          )}

          {chapter.deepDive && !groups[lastGroup]?.deep && (
            <DeepLayer title="Para ir além: leituras e debates">
              <RichText text={chapter.deepDive} className="rt max-w-2xl" />
            </DeepLayer>
          )}

          {chapter.number === 4 && <SponsorSlot />}

          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-ash">
            <span>Atualizado em {formatDate(chapter.updatedAt)}</span>
            <ShareButton title={`${perspective.name}: ${chapter.title}`} path={`/explorar/${lado}/${chapter.slug}`} />
          </div>
        </div>

        {next ? <NextStage side={lado} next={{ href: `/explorar/${lado}/${next.slug}`, number: next.number, kicker: next.kicker, title: next.title }} /> : <JourneyEnd side={lado} />}
      </main>

      <ChapterDock side={lado} chapterSlug={chapter.slug} next={next ? toLink(next) : null} prev={prev ? toLink(prev) : null} counterpart={counterpart} />
      <SiteFooter />
    </div>
  );
}
