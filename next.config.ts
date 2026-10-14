import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 * 'unsafe-inline' em script-src é necessário para os scripts de hidratação
 * do Next sem nonce (que forçaria renderização dinâmica em todas as páginas).
 * Mitigação: nenhum conteúdo editorial é renderizado como HTML bruto — todo
 * texto passa pelo renderizador seguro em src/lib/richtext.tsx.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "1mb" },
  },
  // As imagens de prévia (/og/*) leem a fonte e os retratos do disco em tempo de
  // execução (src/lib/og.ts). Na Vercel, só vai para a função o que for declarado aqui.
  outputFileTracingIncludes: {
    "/opengraph-image": [
      "./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff",
      "./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff",
    ],
    "/og/**/*": [
      "./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff",
      "./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff",
      "./public/candidatos/*.png",
    ],
  },
  // Ferramentas de propostas foram unificadas em /segundo-turno (as fichas individuais continuam).
  async redirects() {
    return [
      { source: "/quem-defende-o-que", destination: "/segundo-turno", permanent: false },
      { source: "/quem-defende-o-que/comparar", destination: "/segundo-turno", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
