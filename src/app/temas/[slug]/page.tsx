import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAffinityModel, getClaims, getThemes } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { SourceButton } from "@/components/evidence/source-panel";
import { ShareButton } from "@/components/ui/share-button";

export const revalidate = 300;

const themeToDimension: Record<string, string> = {
  "papel-do-estado": "estado",
  economia: "economia",
  desigualdade: "social",
  liberdades: "liberdades",
  "seguranca-publica": "seguranca",
  "politicas-sociais": "social",
  "valores-e-costumes": "costumes",
  "meio-ambiente": "ambiente",
  "democracia-e-instituicoes": "instituicoes",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = (await getThemes()).find((x) => x.slug === slug);
  return t ? { title: `${t.name}: os dois lados`, description: t.description, alternates: { canonical: `/temas/${slug}` } } : {};
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const themes = await getThemes();
  const t = themes.find((x) => x.slug === slug);
  if (!t) notFound();
  const claims = await getClaims(t.positions.flatMap((p) => p.claimKeys));
  const { statements } = await getAffinityModel();
  const related = statements.filter((s) => s.dimensionKey === themeToDimension[slug]);

  return (
    <PageFrame kicker="Tema" title={t.name} lead={t.description}>
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        {(["LEFT", "RIGHT"] as const).map((side) => {
          const p = t.positions.find((x) => x.side === side);
          const slugSide = side === "LEFT" ? "esquerda" : "direita";
          return (
            <section key={side} data-side={slugSide} aria-labelledby={`h-${side}`} className="relative bg-graphite p-6 md:p-8">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" />
              <h2 id={`h-${side}`} className="kicker text-[var(--accent-ink)]">Frequentemente associado à {slugSide}</h2>
              {p ? (
                <>
                  <p className="mt-4 font-display text-2xl leading-snug">{p.summary}</p>
                  <ul className="rt mt-5">
                    {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                  <p className="mt-5 border-l-2 border-ev-critique/70 pl-3 text-sm text-paper/80"><span className="kicker mr-2 text-ev-critique">Ressalvas</span>{p.nuances}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5">
                    {p.claimKeys.map((k) => <SourceButton key={k} claim={claims[k]} />)}
                  </div>
                  <Link href={`/explorar/${slugSide}/o-que-defende`} className="kicker link-u mt-6 inline-block text-paper">Ver no capítulo da {slugSide} →</Link>
                </>
              ) : (
                <p className="mt-4 text-ash">Em revisão editorial.</p>
              )}
            </section>
          );
        })}
      </div>

      {t.valueConflict && (
        <section className="mt-16 border-y border-line py-10 text-center">
          <p className="kicker">Conflito de valores</p>
          <p className="display mx-auto mt-4 max-w-4xl text-[clamp(1.8rem,4.5vw,3.4rem)]">{t.valueConflict}</p>
          <p className="mx-auto mt-5 max-w-xl text-paper/75">
            Imparcialidade não significa dizer que tudo é igual. Mas aqui o desacordo é sobre <strong>peso</strong> entre valores desejáveis — e isso nenhum dado decide sozinho.
          </p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="h-section">O outro lado pensa…</h2>
          <p className="mt-3 max-w-2xl text-paper/75">Afirmações relacionadas a este tema, com os argumentos de quem concorda e de quem discorda.</p>
          <ul className="mt-8 space-y-4">
            {related.map((s) => (
              <li key={s.key} className="card p-5 md:p-6">
                <p className="font-display text-xl leading-snug">“{s.text}”</p>
                <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <p><span className="kicker mb-1 block">Quem concorda</span>{s.argumentsAgree}</p>
                  <p><span className="kicker mb-1 block">Quem discorda</span>{s.argumentsDisagree}</p>
                </div>
                <Link href={`/afinidades?revisar=${s.key}`} className="kicker link-u mt-4 inline-block text-paper">Responder esta afirmação →</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex justify-between gap-4">
        <Link href="/temas" className="kicker link-u">← Todos os temas</Link>
        <ShareButton title={`${t.name}: os dois lados`} path={`/temas/${t.slug}`} />
      </div>
    </PageFrame>
  );
}
