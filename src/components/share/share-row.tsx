"use client";

import { Download } from "lucide-react";
import { ShareChip } from "@/components/reel/share-chip";
import { haptic } from "@/lib/haptics";

/** Compartilhar (WhatsApp, link ou menu do celular) + baixar o card para os stories. */
export function ShareRow({ path, title, text, storyHref, fileName, className = "" }: { path: string; title: string; text: string; storyHref: string; fileName: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <ShareChip path={path} title={title} text={text} className="text-[0.72rem] text-paper/80" />
      <a
        href={storyHref}
        download={fileName}
        onClick={() => haptic("tap")}
        className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper/80 hover:text-paper"
      >
        <Download aria-hidden className="h-4 w-4" /> Stories
      </a>
    </div>
  );
}
