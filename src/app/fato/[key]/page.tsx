import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClaims } from "@/lib/content/queries";
import { clip } from "@/lib/og";
import { FactLanding } from "@/components/share/fact-landing";

export const revalidate = 300;

const get = async (key: string) => {
  if (!/^[a-z0-9-]{1,80}$/.test(key)) return null;
  const c = (await getClaims([key]))[key];
  return c && !c.isDemo ? c : null;
};

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const c = await get(key);
  if (!c) return {};
  return {
    title: `Fato com fonte: ${clip(c.text, 70)}`,
    description: c.text,
    // página de destino do compartilhamento (uma frase): não entra no Google
    robots: { index: false, follow: true },
    alternates: { canonical: `/fato/${key}` },
    openGraph: { title: "Fato com fonte", description: c.text, images: [{ url: `/og/fato/${key}`, width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const c = await get(key);
  if (!c) notFound();
  return <FactLanding kicker="Fato com fonte" text={c.text} claim={c} path={`/fato/${key}`} story={`/og/fato/${key}?formato=story`} fileName={`dois-lados-fato-${key}.png`} />;
}
