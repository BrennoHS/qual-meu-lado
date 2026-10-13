import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Ban, EyeOff, LayoutPanelTop, ShieldCheck, Tag, Waypoints } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { AdvertiseForm } from "@/components/advertise/advertise-form";

export const metadata: Metadata = {
  title: "Anuncie no DOIS LADOS",
  description: "Apoio institucional em um site de educação política equilibrada: espaços discretos, sempre sinalizados, sem rastreamento e sem propaganda política.",
  alternates: { canonical: "/anuncie" },
};

const SPACES = [
  { icon: LayoutPanelTop, title: "Rodapé do site", text: "Em todas as páginas de conteúdo, num espaço próprio e sinalizado." },
  { icon: BookOpen, title: "No meio da leitura", text: "Na leitura completa dos capítulos, entre um bloco e outro." },
  { icon: Waypoints, title: "Fim de cada jornada", text: "Quando a pessoa termina de conhecer um lado — o momento de maior atenção." },
];

const RULES = [
  { icon: Ban, text: "Nenhuma propaganda política ou eleitoral. Partidos, candidaturas e governos em campanha não anunciam." },
  { icon: ShieldCheck, text: "Apoio não compra conteúdo: apoiadores não leem textos antes nem pedem mudanças." },
  { icon: EyeOff, text: "Sem rastreamento, pixels ou segmentação. Respeito total à LGPD." },
  { icon: Tag, text: "Sempre sinalizado como “Apoio institucional”, com link marcado como patrocinado." },
];

export default function AdvertisePage() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 90% at 0% 0%, color-mix(in srgb, var(--color-esq-deep) 60%, transparent), transparent 60%), radial-gradient(70% 90% at 100% 100%, color-mix(in srgb, var(--color-dir-deep) 60%, transparent), transparent 60%)" }} />
          <div className="wrap relative py-14 md:py-24">
            <p className="kicker">Anuncie · Apoio institucional</p>
            <h1 className="display mt-4 max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)]">Sua marca ao lado de informação equilibrada.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">
              O DOIS LADOS é lido por quem quer entender política com calma — os dois lados, com fontes. Apoiar o projeto é associar sua marca a
              informação de qualidade, sem polêmica: espaços discretos, sempre sinalizados e sem rastreamento.
            </p>
            <a href="#formulario" className="btn btn-solid mt-8">Quero anunciar</a>
          </div>
        </section>

        <section aria-labelledby="espacos" className="wrap py-14 md:py-20">
          <h2 id="espacos" className="h-section">Onde sua marca aparece</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {SPACES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6">
                <Icon aria-hidden className="h-6 w-6 text-paper/80" />
                <p className="mt-4 font-display text-xl">{title}</p>
                <p className="mt-2 text-sm text-paper/75">{text}</p>
              </li>
            ))}
          </ul>
          <h2 className="h-section mt-16">As regras não mudam</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {RULES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 border-l-2 border-paper/30 py-1 pl-4 text-paper/85">
                <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-paper/70" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ash">
            Detalhes em <Link href="/apoie" className="link-u text-paper">como funciona o apoio</Link>.
          </p>
        </section>

        <section id="formulario" aria-labelledby="form-titulo" className="scroll-mt-16 border-t border-line bg-graphite-2">
          <div className="wrap-text py-14 md:py-20">
            <h2 id="form-titulo" className="h-section">Fale com a gente</h2>
            <p className="mb-8 mt-3 text-paper/80">Sua mensagem vai direto para a equipe, e respondemos no seu e-mail.</p>
            <AdvertiseForm />
          </div>
        </section>
      </main>
      <SiteFooter sponsor={false} />
    </>
  );
}
