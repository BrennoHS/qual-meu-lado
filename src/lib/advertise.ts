/** Assuntos do formulário de anúncio/apoio (compartilhado entre servidor e tela). */
export const INTERESTS = {
  apoio: "Apoio institucional",
  anuncio: "Anúncio / patrocínio de espaço",
  parceria: "Parceria (educação, imprensa, projetos)",
  outro: "Outro assunto",
} as const;
export type Interest = keyof typeof INTERESTS;
