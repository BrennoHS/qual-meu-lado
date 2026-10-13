import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { TransitionProvider } from "@/components/transition/transition-provider";
import { MetricsConfig } from "@/components/metrics-config";
import { isMetricsEnabled } from "@/lib/metrics/server";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"], display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Fonte de rótulos e dados: condensada, de tradição editorial/jornalística.
const label = Barlow_Condensed({ subsets: ["latin"], variable: "--font-label", weight: ["500", "600", "700"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "DOIS LADOS — Dois lados. Milhões de perspectivas.", template: "%s · DOIS LADOS" },
  description:
    "Uma experiência interativa sobre política brasileira: explore o que esquerda e direita defendem, seus argumentos, suas críticas e suas fontes — e forme sua própria conclusão.",
  applicationName: "DOIS LADOS",
  openGraph: { type: "website", locale: "pt_BR", siteName: "DOIS LADOS" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
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
        <a href="#conteudo" className="sr-only-focusable fixed left-4 top-4 z-[100] bg-paper px-4 py-3 text-graphite">
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <TransitionProvider>{children}</TransitionProvider>
          <MetricsConfig enabled={metricsOn} />
        </MotionProvider>
      </body>
    </html>
  );
}
