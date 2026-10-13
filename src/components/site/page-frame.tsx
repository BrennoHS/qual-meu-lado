import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** Moldura padrão das páginas internas. */
export function PageFrame({
  kicker,
  title,
  lead,
  children,
  side,
  narrow = false,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  side?: string;
  narrow?: boolean;
}) {
  return (
    <div data-side={side}>
      <SiteHeader />
      <main id="conteudo">
        <header className="border-b border-line">
          <div className={`${narrow ? "wrap-text" : "wrap"} pb-10 pt-12 md:pb-16 md:pt-20`}>
            {kicker && <p className="kicker">{kicker}</p>}
            <h1 className="display mt-4 text-[clamp(2.4rem,7.5vw,6rem)]">{title}</h1>
            {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">{lead}</p>}
          </div>
        </header>
        <div className={`${narrow ? "wrap-text" : "wrap"} py-12 md:py-16`}>{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
