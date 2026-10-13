import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPerspective } from "@/lib/content/queries";
import { getSideReel } from "@/lib/content/reel";
import { SideReel } from "@/components/reel/side-reel";
import { SponsorSlot } from "@/components/site/sponsor-slot";

export const revalidate = 300;

export async function generateMetadata({ params, searchParams }: { params: Promise<{ lado: string }>; searchParams: Promise<{ cap?: string }> }): Promise<Metadata> {
  const { lado } = await params;
  const { cap } = await searchParams;
  const p = await getPerspective(lado);
  if (!p) return {};
  const ch = p.chapters.find((c) => c.slug === cap) ?? p.chapters[0];
  const title = cap && ch ? `${ch.title} · ${p.name}` : `O que é ser de ${p.name.toLowerCase()}? Ideias, argumentos e críticas`;
  const description = cap && ch
    ? `${ch.kicker} Veja como a esquerda e a direita respondem — em telas curtas, com fontes.`
    : `${p.heroDescription} Entenda em telas curtas e linguagem simples, com fontes — e veja como o outro lado responde.`;
  return {
    title,
    description,
    alternates: { canonical: `/explorar/${lado}` },
    openGraph: { title, description, images: ch ? [{ url: `/og/capitulo/${ch.slug}`, width: 1200, height: 630 }] : undefined },
  };
}

/**
 * Escolheu um lado? Cai direto no reel: telas curtas, uma ideia por vez,
 * os 7 capítulos em sequência. A leitura completa de cada capítulo continua
 * em /explorar/[lado]/[capitulo].
 */
export default async function PerspectiveEntry({ params }: { params: Promise<{ lado: string }> }) {
  const { lado } = await params;
  if (lado !== "esquerda" && lado !== "direita") notFound();
  const data = await getSideReel(lado);
  if (!data || data.slides.length === 0) notFound();
  return <SideReel data={data} sponsor={<SponsorSlot />} />;
}
