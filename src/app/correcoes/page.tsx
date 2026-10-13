import Link from "next/link";
import type { Metadata } from "next";
import { getCorrections } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { formatDate } from "@/lib/labels";

export const revalidate = 300;
export const metadata: Metadata = { title: "Registro de correções", alternates: { canonical: "/correcoes" } };

export default async function CorrectionsPage() {
  const list = await getCorrections();
  return (
    <PageFrame kicker="Transparência" title="Registro de correções" lead="Toda correção relevante é registrada aqui, com data e descrição do que mudou." narrow>
      {list.length === 0 ? (
        <p role="status" className="text-ash">Nenhuma correção publicada até o momento.</p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {list.map((c) => (
            <li key={c.id} className="py-6">
              <p className="font-mono text-xs text-ash">{formatDate(c.correctedAt)}{c.entityRef ? ` · ${c.entityRef}` : ""}</p>
              <h2 className="mt-1 font-display text-xl">{c.title}</h2>
              <p className="mt-2 text-paper/85">{c.description}</p>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-10 text-sm text-ash">Encontrou um erro? <Link href="/contato" className="link-u text-paper">Reporte aqui</Link>.</p>
    </PageFrame>
  );
}
