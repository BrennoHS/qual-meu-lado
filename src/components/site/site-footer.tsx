import Link from "next/link";
import { getSettings } from "@/lib/content/queries";
import { Brand } from "./site-header";
import { SponsorSlot } from "./sponsor-slot";

const institutional = [
  { href: "/como-construimos", label: "Como construímos este site" },
  { href: "/politica-editorial", label: "Política editorial" },
  { href: "/correcoes", label: "Registro de correções" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de uso" },
  { href: "/contato", label: "Reportar erro / contato" },
  { href: "/anuncie", label: "Anuncie no DOIS LADOS" },
  { href: "/apoie", label: "Apoie o projeto" },
  { href: "/creditos", label: "Créditos das imagens" },
];

export async function SiteFooter({ sponsor = true }: { sponsor?: boolean } = {}) {
  const { hero, notice } = await getSettings();
  return (
    <footer className="border-t border-line bg-graphite">
      {sponsor && <SponsorSlot variant="footer" />}
      {notice.enabled && (
        <div role="note" className="border-b border-line bg-graphite-2">
          <p className="wrap py-3 text-center font-mono text-xs leading-relaxed text-ash">{notice.text}</p>
        </div>
      )}
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm font-display text-xl leading-snug">{hero.finalPhrase}</p>
          <p className="mt-4 max-w-sm text-sm text-ash">Projeto educativo independente. Não é propaganda eleitoral, não é pesquisa eleitoral e não recomenda candidaturas.</p>
        </div>
        <nav aria-label="Explorar">
          <p className="kicker mb-4">Explorar</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-u" href="/explorar/esquerda">Esquerda</Link></li>
            <li><Link className="link-u" href="/explorar/direita">Direita</Link></li>
            <li><Link className="link-u" href="/afinidades">Teste de afinidade</Link></li>
            <li><Link className="link-u" href="/temas">Tema por tema</Link></li>
            <li><Link className="link-u" href="/glossario">Glossário</Link></li>
            <li><Link className="link-u" href="/linha-do-tempo">Linha do tempo</Link></li>
            <li><Link className="link-u" href="/mitos">Mitos e realidades</Link></li>
            <li><Link className="link-u" href="/segundo-turno">Propostas do 2º turno</Link></li>
            <li><Link className="link-u" href="/fontes">Fontes</Link></li>
          </ul>
        </nav>
        <nav aria-label="Transparência">
          <p className="kicker mb-4">Transparência</p>
          <ul className="space-y-2 text-sm">
            {institutional.map((l) => (
              <li key={l.href}><Link className="link-u" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
