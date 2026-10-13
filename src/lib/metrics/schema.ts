import { z } from "zod";

/**
 * Contrato da medição agregada. Lista FECHADA de eventos e chaves curtas,
 * sem texto livre: impossível mandar respostas, nomes ou qualquer dado pessoal.
 *
 * "reel_depth" = até qual tela um reel foi visto antes de a pessoa sair.
 * Nas propostas, a chave é só o TEMA ("segundo-turno:r-saude"), nunca a
 * candidatura — para não existir nenhum número do tipo "quantos viram X".
 */
export const METRIC_EVENTS = ["reel_depth"] as const;
export const metricPayload = z.object({
  e: z.enum(METRIC_EVENTS),
  k: z
    .string()
    .min(3)
    .max(80)
    .regex(/^(esquerda|direita|segundo-turno):[a-z0-9-]+$/),
});
export type MetricPayload = z.infer<typeof metricPayload>;

/** Abaixo disso o painel mostra "<10" (evita leituras sobre grupos minúsculos). */
export const MIN_DISPLAY_COUNT = 10;
export const RETENTION_DAYS = 90;
