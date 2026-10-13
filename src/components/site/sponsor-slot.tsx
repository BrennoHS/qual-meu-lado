import Link from "next/link";
import { Megaphone } from "lucide-react";
import { getSettings } from "@/lib/content/queries";
import { AdvertiseDialog } from "@/components/advertise/advertise-form";

/**
 * Espaço de apoio institucional. Discreto, sempre sinalizado, sem rastreamento.
 * Nunca é exibido em páginas de candidaturas, no mapa de afinidades nem na
 * escolha final (regra em /apoie). Configurável em "Destaques da home e avisos".
 * Sem apoiador, vira um convite claro — e o botão abre o formulário na hora.
 */
export async function SponsorSlot({ variant = "inline" }: { variant?: "inline" | "footer" }) {
  const { sponsorship } = await getSettings();
  if (!sponsorship?.enabled) return null;
  const sponsor = sponsorship.sponsors?.[0];
  const wrap = variant === "footer" ? "border-b border-line" : "";

  if (sponsor) {
    return (
      <aside aria-label={sponsorship.label} className={wrap}>
        <div className={variant === "footer" ? "wrap py-5" : ""}>
          <div className="flex flex-col gap-3 border border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="kicker shrink-0 rounded-full border border-line px-2.5 py-1 text-ash">{sponsorship.label}</span>
              <p className="text-sm text-paper/85">
                <a href={sponsor.url} target="_blank" rel="sponsored noopener noreferrer" className="link-u font-medium text-paper">
                  {sponsor.name}
                </a>{" "}
                — {sponsor.text}
              </p>
            </div>
            <Link href="/apoie" className="kicker shrink-0 text-ash hover:text-paper hover:underline">
              Como funciona o apoio
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label={sponsorship.label} className={wrap}>
      <div className={variant === "footer" ? "wrap py-6" : ""}>
        <div className="relative flex flex-col gap-4 overflow-hidden border border-paper/20 bg-[linear-gradient(110deg,color-mix(in_srgb,var(--color-esq-deep)_35%,transparent),transparent_45%,color-mix(in_srgb,var(--color-dir-deep)_35%,transparent))] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-paper/30">
              <Megaphone aria-hidden className="h-5 w-5 text-paper/85" />
            </span>
            <div>
              <p className="kicker text-ash">Espaço para {sponsorship.label.toLowerCase()}</p>
              <p className="mt-1 font-display text-lg leading-snug md:text-xl">Sua marca ao lado de informação equilibrada.</p>
              <p className="mt-1 text-sm text-paper/70">Sem propaganda política, sem rastreamento, sempre sinalizado.</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <AdvertiseDialog className="btn btn-solid">Quero anunciar aqui</AdvertiseDialog>
            <Link href="/anuncie" className="kicker hidden text-ash hover:text-paper hover:underline md:inline">
              Saiba mais
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
