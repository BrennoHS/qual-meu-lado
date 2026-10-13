import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CANDIDATE_PHOTOS, orderForHome, PHOTO_EDIT_NOTE } from "@/lib/election";

export const metadata: Metadata = {
  title: "Créditos de imagens e recursos",
  description: "Autoria e licença das fotos, fontes tipográficas e recursos usados no DOIS LADOS.",
  alternates: { canonical: "/creditos" },
};

const NAMES: Record<string, string> = { lula: "Luiz Inácio Lula da Silva", "flavio-bolsonaro": "Flávio Bolsonaro" };

const FONTS = [
  { name: "Space Grotesk", author: "Florian Karsten", license: "SIL Open Font License 1.1" },
  { name: "Inter", author: "Rasmus Andersson", license: "SIL Open Font License 1.1" },
  { name: "Barlow Condensed", author: "Jeremy Tribby", license: "SIL Open Font License 1.1" },
];

export default function CreditsPage() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="wrap-text py-14 md:py-20">
        <p className="kicker">Transparência</p>
        <h1 className="h-section mt-3">Créditos de imagens e recursos</h1>
        <p className="mt-4 text-paper/80">Tudo o que não foi produzido pela equipe do DOIS LADOS, com autoria, licença e link para a origem.</p>

        <h2 className="mt-12 font-display text-2xl">Retratos das candidaturas</h2>
        <p className="mt-2 text-sm text-ash">{PHOTO_EDIT_NOTE} As duas fotos recebem exatamente o mesmo tratamento.</p>
        <ul className="mt-5 space-y-4">
          {orderForHome(Object.entries(CANDIDATE_PHOTOS).map(([slug, p]) => ({ slug, p }))).map(({ slug, p }) => (
            <li key={slug} className="card p-5">
              <p className="font-display text-lg">{NAMES[slug] ?? slug}</p>
              <p className="mt-1 text-sm text-paper/85">Foto: {p.credit} · Licença: {p.license}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="kicker link-u mt-2 inline-block text-paper">Original no Wikimedia Commons <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></a>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-2xl">Fontes tipográficas</h2>
        <ul className="mt-4 space-y-2 text-sm text-paper/85">
          {FONTS.map((f) => (
            <li key={f.name}>{f.name} — {f.author} · {f.license}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-2xl">Ilustrações e ícones</h2>
        <p className="mt-2 text-sm text-paper/85">Plenário, Congresso, urna, balança, ícones dos temas e demais ilustrações foram desenhados para este projeto.</p>

        <h2 className="mt-12 font-display text-2xl">Voz do botão “Ouvir”</h2>
        <p className="mt-2 text-sm text-paper/85">A leitura em voz alta usa a voz sintética instalada no seu próprio aparelho ou navegador. Não é a voz de nenhuma pessoa real.</p>
      </main>
      <SiteFooter />
    </>
  );
}
