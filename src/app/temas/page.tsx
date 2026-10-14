import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getThemes } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Diferença entre esquerda e direita, tema por tema",
  description: "Economia, Estado, segurança, educação, saúde, costumes e mais: o que a esquerda e a direita costumam defender em 11 temas, lado a lado, com ressalvas e fontes.",
  alternates: { canonical: "/temas" },
};

export default async function ThemesPage() {
  const themes = await getThemes();
  return (
    <PageFrame
      kicker="Aprofundar"
      title="Temas"
      lead="Onze temas, os dois lados lado a lado. Em cada um, um conflito de valores que não se resolve com dados: liberdade, igualdade, segurança, responsabilidade fiscal."
    >
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t, i) => (
          <li key={t.slug} className="bg-graphite">
            <Reveal delay={(i % 3) * 0.05} className="h-full">
              <Link href={`/temas/${t.slug}`} className="group flex h-full min-h-56 flex-col justify-between p-6 hover:bg-graphite-2">
                <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-2xl tracking-tight group-hover:underline">{t.name}</span>
                  <span className="mt-2 block text-sm text-paper/70">{t.description}</span>
                  {t.valueConflict && <span className="mt-4 block font-mono text-xs text-ev-critique"><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /> {t.valueConflict}</span>}
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
