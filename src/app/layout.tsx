import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { TransitionProvider } from "@/components/transition/transition-provider";
import { MetricsConfig } from "@/components/metrics-config";
import { isMetricsEnabled } from "@/lib/metrics/server";
import { JsonLd, SITE_URL } from "@/components/seo/json-ld";
import { VercelInsights } from "@/components/site/vercel-insights";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"], display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Fonte de rótulos e dados: condensada, de tradição editorial/jornalística.
const label = Barlow_Condensed({ subsets: ["latin"], variable: "--font-label", weight: ["500", "600", "700"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Esquerda ou direita? Entenda os dois lados e descubra o seu · DOIS LADOS", template: "%s · DOIS LADOS" },
  description:
    "O que é ser de esquerda? E de direita? Entenda as ideias, os melhores argumentos e as críticas de cada lado, faça o teste de afinidade política e compare as propostas do 2º turno de 2026 — com fontes, sem torcida.",
  applicationName: "DOIS LADOS",
  openGraph: { type: "website", locale: "pt_BR", siteName: "DOIS LADOS" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Google Search Console / Bing: cole o código de verificação nas variáveis de ambiente.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#111318",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const metricsOn = await isMetricsEnabled();
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${label.variable}`}>
      <body className="min-h-svh">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DOIS LADOS",
              alternateName: "Qual meu lado?",
              url: SITE_URL,
              inLanguage: "pt-BR",
              description: "Educação política equilibrada: o que esquerda e direita defendem, argumentos, críticas, teste de afinidade e propostas do 2º turno — com fontes.",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DOIS LADOS",
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              description: "Projeto independente de educação política, sem vínculo partidário.",
            },
          ]}
        />
        <a href="#conteudo" className="sr-only-focusable fixed left-4 top-4 z-[100] bg-paper px-4 py-3 text-graphite">
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <TransitionProvider>{children}</TransitionProvider>
          <MetricsConfig enabled={metricsOn} />
        </MotionProvider>
        {/* estatísticas anônimas: só no site publicado (os scripts existem apenas na Vercel) */}
        {process.env.VERCEL_ENV === "production" && <VercelInsights />}
      </body>
    </html>
  );
}
