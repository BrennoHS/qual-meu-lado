import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="wrap flex min-h-[70svh] flex-col justify-center py-20">
        <p className="kicker">Erro 404</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,9vw,7rem)]">Nenhum dos dois lados.</h1>
        <p className="mt-6 max-w-lg text-lg text-paper/75">Esta página não existe ou ainda não foi publicada.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-solid">Voltar ao início</Link>
          <Link href="/explorar/esquerda" className="btn" data-side="esquerda">Conhecer a esquerda</Link>
          <Link href="/explorar/direita" className="btn" data-side="direita">Conhecer a direita</Link>
          <Link href="/afinidades" className="btn btn-afinidade">Descobrir minha afinidade</Link>
        </div>
      </main>
    </>
  );
}
