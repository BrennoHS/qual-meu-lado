import Link from "next/link";
import { EditorialPage, editorialMetadata } from "@/components/site/editorial-page";
import { AdvertiseDialog } from "@/components/advertise/advertise-form";

export const revalidate = 300;
export const generateMetadata = () => editorialMetadata("apoie");

export default function Page() {
  return (
    <EditorialPage slug="apoie">
      <section aria-labelledby="quer-apoiar" className="mt-12 border border-paper/25 bg-graphite-2 p-6 md:p-8">
        <h2 id="quer-apoiar" className="h-section">Quer apoiar ou anunciar?</h2>
        <p className="mt-3 text-paper/80">Sua mensagem vai direto para a equipe.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <AdvertiseDialog className="btn btn-solid" defaultInterest="apoio">Falar com a equipe</AdvertiseDialog>
          <Link href="/anuncie" className="kicker link-u text-paper">Ver os espaços de anúncio</Link>
        </div>
      </section>
    </EditorialPage>
  );
}
