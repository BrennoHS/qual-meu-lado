import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import { getClaims } from "@/lib/content/queries";
import { clip } from "@/lib/og";
import { FactLanding } from "@/components/share/fact-landing";

export const revalidate = 300;

const get = async (slug: string) =>
  /^[a-z0-9-]{1,80}$/.test(slug) ? db.curiosity.findFirst({ where: { slug, status: { in: PUBLIC_STATUSES } } }) : null;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await get(slug);
  if (!c) return {};
  return {
    title: `Você sabia? ${clip(c.text, 70)}`,
    description: c.text,
    // página de destino do compartilhamento (uma frase): não entra no Google
    robots: { index: false, follow: true },
    alternates: { canonical: `/sabia/${slug}` },
    openGraph: { title: "Você sabia?", description: c.text, images: [{ url: `/og/sabia/${slug}`, width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await get(slug);
  if (!c) notFound();
  const claim = c.claimKey ? ((await getClaims([c.claimKey]))[c.claimKey] ?? null) : null;
  return <FactLanding kicker="Você sabia?" text={c.text} claim={claim} path={`/sabia/${slug}`} story={`/og/sabia/${slug}?formato=story`} fileName={`dois-lados-voce-sabia-${slug}.png`} />;
}
