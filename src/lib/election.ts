/**
 * Configuração do "Duelo de propostas" do 2º turno.
 * As rodadas são temas neutros, na mesma ordem para todos. Nenhuma rodada
 * "favorece" uma candidatura: a ordem segue o índice temático do TSE.
 */
export const SECOND_ROUND_DATE = "2026-10-25T08:00:00-03:00";

export type Round = { slug: string; label: string; question: string; icon: IconName };
export type IconName = "coin" | "briefcase" | "shield" | "book" | "cross" | "hands" | "leaf" | "ballot";

export const ROUNDS: Round[] = [
  { slug: "economia", label: "Economia e impostos", question: "Como cuidar das contas do país e dos impostos que você paga?", icon: "coin" },
  { slug: "trabalho", label: "Trabalho e renda", question: "O que muda para quem trabalha?", icon: "briefcase" },
  { slug: "seguranca-publica", label: "Segurança", question: "Como enfrentar o crime e a violência?", icon: "shield" },
  { slug: "educacao", label: "Educação", question: "Como melhorar a escola?", icon: "book" },
  { slug: "saude", label: "Saúde", question: "Como reduzir filas e cuidar melhor das pessoas?", icon: "cross" },
  { slug: "politicas-sociais", label: "Programas sociais", question: "O que acontece com quem depende de ajuda do governo?", icon: "hands" },
  { slug: "meio-ambiente", label: "Meio ambiente", question: "Como proteger as florestas e o clima?", icon: "leaf" },
  { slug: "democracia-e-instituicoes", label: "Democracia e instituições", question: "Como devem funcionar o governo, a Justiça e as redes?", icon: "ballot" },
];

export const roundLabel = (slug: string) => ROUNDS.find((r) => r.slug === slug)?.label ?? slug;

/** Dias inteiros até o 2º turno (0 = é hoje; negativo = já passou). */
export function daysUntil(dateIso: string, now = new Date()): number {
  const target = new Date(dateIso);
  const startOfDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000);
}

/**
 * Retratos usados no modo "Ver propostas" e nos reels das candidaturas.
 * Fotos oficiais, com o MESMO tratamento para as duas: recorte do rosto na
 * mesma escala, fundo removido, tons de cinza e esmaecimento na base
 * (o que também tira de cena bandeiras e faixa presidencial).
 */
export type CandidatePhoto = { src: string; credit: string; license: string; url: string };
export const CANDIDATE_PHOTOS: Record<string, CandidatePhoto> = {
  "flavio-bolsonaro": {
    src: "/candidatos/flavio-bolsonaro.png",
    credit: "Agência Senado (foto oficial de senador, 2019)",
    license: "uso livre com crédito",
    url: "https://commons.wikimedia.org/wiki/File:Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_(v._AgSen).jpg",
  },
  lula: {
    src: "/candidatos/lula.png",
    credit: "Ricardo Stuckert/PR (foto oficial, 2023)",
    license: "CC BY 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_(ombros)_denoise.jpg",
  },
};
export const PHOTO_EDIT_NOTE = "Imagens recortadas, sem fundo e em tons de cinza.";

/**
 * Posição das candidaturas no modo "Ver propostas" da home. A metade
 * esquerda (em cima no celular) e a direita (embaixo) seguem a mesma
 * convenção do hero de ideias, para as setas "← / →" não se contradizerem.
 * Cores continuam neutras: a posição não é um selo ideológico.
 */
export const HOME_CANDIDATE_ORDER = ["lula", "flavio-bolsonaro"];
export function orderForHome<T extends { slug: string }>(list: T[]): T[] {
  const rank = (s: string) => {
    const i = HOME_CANDIDATE_ORDER.indexOf(s);
    return i < 0 ? HOME_CANDIDATE_ORDER.length : i;
  };
  return [...list].sort((a, b) => rank(a.slug) - rank(b.slug));
}
