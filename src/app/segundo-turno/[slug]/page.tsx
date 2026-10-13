import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCandidateReel } from "@/lib/content/reel";
import { CandidateReel } from "@/components/reel/candidate-reel";
import { ROUNDS } from "@/lib/election";

export const revalidate = 300;

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ tema?: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { tema } = await searchParams;
  const data = await getCandidateReel(slug);
  if (!data) return {};
  const round = ROUNDS.find((r) => r.slug === tema);
  // Link de um tema: título e imagem mostram AS DUAS candidaturas (nunca só uma).
  const title = round ? `${round.label}: o que propõem ${data.candidate.ballotName} e ${data.rival.ballotName}` : `Propostas de ${data.candidate.ballotName} · 2º turno 2026`;
  const description = round
    ? `${round.question} Compare as duas propostas, com o trecho do plano registrado no TSE. Sem ranking e sem recomendação de voto.`
    : `As propostas principais de ${data.candidate.ballotName} em 8 temas, com o trecho exato do plano de governo registrado no TSE. Sem ranking e sem recomendação de voto.`;
  return {
    title,
    description,
    alternates: { canonical: `/segundo-turno/${slug}` },
    openGraph: { title, description, images: [{ url: `/og/tema/${round?.slug ?? "geral"}`, width: 1200, height: 630 }] },
  };
}

export default async function CandidateReelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCandidateReel(slug);
  if (!data) notFound();
  return <CandidateReel data={data} />;
}
