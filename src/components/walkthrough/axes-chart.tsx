type Point = { slug: string; name: string; econX: number | null; socialY: number | null; side: string | null };

/**
 * Esquema DIDÁTICO de duas dimensões. Posições são aproximações editoriais,
 * não medições — o aviso aparece sempre junto do gráfico.
 */
export function AxesChart({ points, highlight }: { points: Point[]; highlight: string[] }) {
  const pts = points.filter((p) => p.econX !== null && p.socialY !== null);
  const W = 420;
  const H = 440;
  const pad = 40;
  const x = (v: number) => pad + ((v + 1) / 2) * (W - pad * 2);
  const y = (v: number) => pad + ((v + 1) / 2) * (H - pad * 2);

  return (
    <figure>
      <div className="relative border border-line bg-graphite-2/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="axes-title axes-desc">
          <title id="axes-title">Esquema didático: economia e costumes</title>
          <desc id="axes-desc">
            Eixo horizontal: de mais coordenação estatal (esquerda do gráfico) a mais coordenação de mercado (direita do gráfico). Eixo vertical: de mais abertura a mudanças nos
            costumes (topo) a mais preservação de tradições (base). {pts.map((p) => `${p.name}: posição aproximada ${p.econX! < 0 ? "mais Estado" : "mais mercado"}, ${p.socialY! < 0 ? "mais mudança" : "mais tradição"}.`).join(" ")}
          </desc>
          {[-0.5, 0, 0.5].map((v) => (
            <g key={v} stroke="var(--color-line)" strokeWidth={v === 0 ? 1.2 : 0.6} strokeDasharray={v === 0 ? undefined : "3 5"}>
              <line x1={x(v)} x2={x(v)} y1={pad} y2={H - pad} />
              <line x1={pad} x2={W - pad} y1={y(v)} y2={y(v)} />
            </g>
          ))}
          <g fill="var(--color-ash)" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="0.5">
            <text x={pad} y={H - pad + 24}>← MAIS ESTADO</text>
            <text x={W - pad} y={H - pad + 24} textAnchor="end">MAIS MERCADO →</text>
            <text x={pad - 12} y={pad} transform={`rotate(-90 ${pad - 12} ${pad})`} textAnchor="end">MAIS MUDANÇA ↑</text>
            <text x={pad - 12} y={H - pad} transform={`rotate(-90 ${pad - 12} ${H - pad})`} textAnchor="start">↓ MAIS TRADIÇÃO</text>
          </g>
          {pts.map((p) => {
            const hi = highlight.includes(p.slug);
            const cx = x(p.econX!);
            const cy = y(p.socialY!);
            const anchor = cx > W - 150 ? "end" : "start";
            return (
              <g key={p.slug} opacity={hi ? 1 : 0.42}>
                <circle cx={cx} cy={cy} r={hi ? 22 : 14} fill={hi ? "var(--accent)" : "var(--color-ash)"} opacity={0.18} />
                <circle cx={cx} cy={cy} r={hi ? 5 : 3.5} fill={hi ? "var(--accent-ink)" : "var(--color-ash)"} />
                <text x={anchor === "end" ? cx - 12 : cx + 12} y={cy + 4} textAnchor={anchor} fill={hi ? "var(--color-paper)" : "var(--color-ash)"} fontSize={hi ? 15 : 13} fontFamily="var(--font-sans)" fontWeight={hi ? 600 : 400}>
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ash">
        ESQUEMA DIDÁTICO — posições aproximadas atribuídas pela equipe editorial para ilustrar que economia e costumes variam de forma independente. Não é medição; cada corrente abriga
        posições diversas. Correntes em destaque: as discutidas neste capítulo.
      </figcaption>
    </figure>
  );
}
