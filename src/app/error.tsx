"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="conteudo" role="alert" className="wrap flex min-h-[70svh] flex-col justify-center py-20">
      <p className="kicker">Algo deu errado</p>
      <h1 className="display mt-4 text-[clamp(2.2rem,7vw,5rem)]">Não conseguimos carregar esta página.</h1>
      <p className="mt-6 max-w-lg text-paper/75">Pode ser uma falha temporária. Tente de novo; se persistir, avise a equipe pelo formulário de contato.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-ash">Código: {error.digest}</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-solid">Tentar novamente</button>
        <Link href="/" className="btn">Início</Link>
      </div>
    </main>
  );
}
