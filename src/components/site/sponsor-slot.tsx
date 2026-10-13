import Link from "next/link";
import { getSettings } from "@/lib/content/queries";

/**
 * Espaço de apoio institucional. Discreto, sempre sinalizado, sem rastreamento.
 * Nunca é exibido em páginas de candidaturas, no mapa de afinidades nem na
 * escolha final (regra em /apoie). Configurável em "Destaques da home e avisos".
 */
export async function SponsorSlot({ variant = "inline" }: { variant?: "inline" | "footer" }) {
  const { sponsorship } = await getSettings();
  if (!sponsorship?.enabled) return null;
  const sponsor = sponsorship.sponsors?.[0];
  const wrap = variant === "footer" ? "border-b border-line" : "";
  return (
    <aside aria-label={sponsorship.label} className={wrap}>
      <div className={variant === "footer" ? "wrap py-5" : ""}>
        <div className="flex flex-col gap-3 border border-dashed border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="kicker shrink-0 rounded-full border border-line px-2.5 py-1 text-ash">{sponsorship.label}</span>
            {sponsor ? (
              <p className="text-sm text-paper/85">
                <a href={sponsor.url} target="_blank" rel="sponsored noopener noreferrer" className="link-u font-medium text-paper">
                  {sponsor.name}
                </a>{" "}
                — {sponsor.text}
              </p>
            ) : (
              <p className="text-sm text-ash">{sponsorship.placeholder}</p>
            )}
          </div>
          <Link href="/apoie" className="kicker shrink-0 text-paper hover:underline">
            {sponsor ? "Como funciona o apoio" : "Seja um apoiador →"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
