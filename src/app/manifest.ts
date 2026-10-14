import type { MetadataRoute } from "next";

/** Nome, cor e ícone do site (atalho na tela inicial do celular, abas, buscadores). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DOIS LADOS — Esquerda ou direita?",
    short_name: "DOIS LADOS",
    description: "Entenda os dois lados da política, com fontes — e descubra o seu.",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#111318",
    theme_color: "#111318",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
