"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Player do YouTube em modo de privacidade, carregado só depois do clique:
 * antes disso, nada é enviado ao Google (só a miniatura, uma imagem).
 * Se a emissora desativar a incorporação, o próprio player avisa — e o link
 * "assistir no YouTube" fica sempre visível.
 */
export function DebatePlayer({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center" aria-label={`Assistir: ${title}`}>
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill unoptimized priority className="object-cover opacity-60 transition-opacity group-hover:opacity-75" />
          <span className="relative flex flex-col items-center gap-3">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-paper text-graphite shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105">
              <Play aria-hidden className="ml-1 h-9 w-9" fill="currentColor" />
            </span>
            <span className="rounded-full bg-graphite/80 px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-paper">Assistir ao vivo</span>
          </span>
        </button>
      )}
    </div>
  );
}
