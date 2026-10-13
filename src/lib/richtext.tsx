import { Fragment, type ReactNode } from "react";
import { glossCtx, glossNodes, type GlossCtx } from "@/lib/glossary";

/**
 * Renderizador SEGURO de texto editorial (markdown simplificado).
 * Nunca usa dangerouslySetInnerHTML: o texto vira elementos React, então
 * qualquer HTML digitado no painel é exibido como texto, não executado.
 *
 * Suporta: parágrafos (linha em branco), "## " títulos, "- " listas,
 * "1. " listas numeradas, **negrito**, *itálico* e [links](https://… ou /interno).
 */

const SAFE_HREF = /^(https?:\/\/|\/(?!\/)|#|mailto:)/i;

export function isSafeHref(href: string): boolean {
  return SAFE_HREF.test(href.trim());
}

function inline(text: string, keyPrefix: string, gloss?: GlossCtx): ReactNode[] {
  const plain = (t: string, k: string): ReactNode[] => (gloss ? glossNodes(t, gloss, k) : [t]);
  const out: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(...plain(text.slice(last, m.index), `${keyPrefix}-t${i}`));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const label = tok.slice(1, tok.indexOf("]"));
      const href = tok.slice(tok.indexOf("(") + 1, -1);
      if (isSafeHref(href)) {
        const external = /^https?:/i.test(href);
        out.push(
          <a key={key} href={href} className="rt-link" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>,
        );
      } else out.push(label);
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(...plain(text.slice(last), `${keyPrefix}-end`));
  return out;
}

/** gloss: marca palavras do glossário como "toque para entender" (até 3 por bloco). */
export function RichText({ text, className, gloss = false }: { text: string; className?: string; gloss?: boolean }) {
  const g = gloss ? glossCtx(3) : undefined;
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className={className ?? "rt"}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (lines.length === 0) return null;
        const key = `b${bi}`;
        if (lines[0].startsWith("## ")) {
          return (
            <Fragment key={key}>
              <h3>{inline(lines[0].slice(3), key, g)}</h3>
              {lines.length > 1 && <p>{inline(lines.slice(1).join(" "), `${key}p`, g)}</p>}
            </Fragment>
          );
        }
        if (lines.every((l) => /^- /.test(l))) {
          return <ul key={key}>{lines.map((l, li) => <li key={li}>{inline(l.slice(2), `${key}-${li}`, g)}</li>)}</ul>;
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return <ol key={key}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\d+\. /, ""), `${key}-${li}`, g)}</li>)}</ol>;
        }
        return <p key={key}>{inline(lines.join(" "), key, g)}</p>;
      })}
    </div>
  );
}

/** Versão em texto puro (metadados, aria-labels). */
export function plainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+ /gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
