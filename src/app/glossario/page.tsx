import type { Metadata } from "next";
import Link from "next/link";
import { glossary } from "@content/glossary";
import { PageFrame } from "@/components/site/page-frame";
import { JsonLd, SITE_URL, breadcrumbs } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Glossário político: termos explicados em linguagem simples",
  description:
    "O que é Estado, PEC, Selic, social-democracia, liberalismo, arcabouço fiscal, privatização? Os termos da política e da economia explicados em uma frase, sem jargão.",
  alternates: { canonical: "/glossario" },
};

/** Primeira letra sem acento, para agrupar (É → E, Ç → C). */
const letterOf = (term: string) => term.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  const groups = new Map<string, typeof terms>();
  for (const t of terms) {
    const l = letterOf(t.term);
    groups.set(l, [...(groups.get(l) ?? []), t]);
  }

  return (
    <PageFrame
      kicker="Glossário"
      title="Palavras da política, em uma frase"
      lead={`${terms.length} termos que aparecem no noticiário e nos debates, explicados sem jargão. Nos textos do site, toque numa palavra sublinhada para ver a mesma explicação.`}
    >
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Glossário político DOIS LADOS",
            url: `${SITE_URL}/glossario`,
            inLanguage: "pt-BR",
            hasDefinedTerm: terms.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.definition,
              url: `${SITE_URL}/glossario#${t.id}`,
            })),
          },
          breadcrumbs([
            { name: "DOIS LADOS", path: "/" },
            { name: "Glossário", path: "/glossario" },
          ]),
        ]}
      />

      <nav aria-label="Letras" className="flex flex-wrap gap-2">
        {[...groups.keys()].map((l) => (
          <a key={l} href={`#letra-${l}`} className="chip min-w-10 justify-center font-mono">
            {l}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {[...groups.entries()].map(([l, items]) => (
          <section key={l} id={`letra-${l}`} aria-labelledby={`h-${l}`} className="scroll-mt-20">
            <h2 id={`h-${l}`} className="font-display text-4xl text-paper/40">
              {l}
            </h2>
            <dl className="mt-4 grid gap-3 md:grid-cols-2">
              {items.map((t) => (
                <div key={t.id} id={t.id} className="scroll-mt-20 border border-line p-5 target:border-paper/60 target:bg-graphite-2">
                  <dt className="font-display text-xl tracking-tight">{t.term}</dt>
                  <dd className="mt-2 leading-relaxed text-paper/80">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-3 border-t border-line pt-8">
        <Link href="/temas" className="btn">
          Esquerda e direita, tema por tema
        </Link>
        <Link href="/afinidades" className="btn btn-solid">
          Descobrir minha afinidade
        </Link>
      </div>
    </PageFrame>
  );
}
