import type { ReactNode } from "react";
import { glossary, type GlossaryEntry } from "../../content/glossary";
import { GlossTerm } from "@/components/glossary/gloss-term";

/**
 * Encontra palavras do glossário num texto e as transforma em "toque para
 * entender". Sem directive de cliente: roda no servidor (leitura completa)
 * e no navegador (reel). Limita quantos termos marcar por bloco, para o
 * texto não virar um mar de sublinhados.
 */

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const lookup = new Map<string, GlossaryEntry>();
const variants: string[] = [];
for (const e of glossary) {
  for (const f of e.forms) {
    const vs = e.exact ? [f] : [...new Set([f, f.toLowerCase(), cap(f.toLowerCase())])];
    for (const v of vs) {
      if (!lookup.has(v)) {
        lookup.set(v, e);
        variants.push(v);
      }
    }
  }
}
variants.sort((a, b) => b.length - a.length);
const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${variants.map(escape).join("|")})(?![\\p{L}\\p{N}])`, "gu");

/** Contexto compartilhado entre os pedaços de um mesmo bloco (cada termo marcado uma vez). */
export type GlossCtx = { seen: Set<string>; left: number };
export const glossCtx = (limit = 2): GlossCtx => ({ seen: new Set(), left: limit });

export type GlossSegment = { text: string; entry?: GlossaryEntry };

export function glossSegments(text: string, ctx: GlossCtx): GlossSegment[] {
  if (ctx.left <= 0) return [{ text }];
  const out: GlossSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const entry = lookup.get(m[0]);
    if (!entry || ctx.seen.has(entry.id) || ctx.left <= 0) continue;
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], entry });
    ctx.seen.add(entry.id);
    ctx.left -= 1;
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export function glossNodes(text: string, ctx: GlossCtx, keyPrefix = "g"): ReactNode[] {
  return glossSegments(text, ctx).map((s, i) =>
    s.entry ? (
      <GlossTerm key={`${keyPrefix}-${i}`} term={s.entry.term} definition={s.entry.definition}>
        {s.text}
      </GlossTerm>
    ) : (
      s.text
    ),
  );
}

/** Texto simples com palavras difíceis tocáveis. */
export function Gloss({ text, limit = 2 }: { text: string; limit?: number }) {
  return <>{glossNodes(text, glossCtx(limit))}</>;
}
