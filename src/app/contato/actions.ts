"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { clientFingerprint, rateLimit } from "@/lib/security/rate-limit";

export type ReportState = { ok: boolean; message: string; errors?: Record<string, string> };

const schema = z.object({
  pageUrl: z.string().trim().max(300).default(""),
  message: z.string().trim().min(10, "Descreva o problema com pelo menos 10 caracteres.").max(4000, "Máximo de 4.000 caracteres."),
  contactEmail: z.union([z.literal(""), z.string().trim().email("E-mail inválido.").max(200)]).default(""),
  website: z.string().max(0).optional(), // honeypot: deve ficar vazio
});

/** Relato de erro. Não guarda IP; e-mail é opcional. Validação no servidor. */
export async function submitReport(_: ReportState, form: FormData): Promise<ReportState> {
  const parsed = schema.safeParse({
    pageUrl: form.get("pageUrl") ?? "",
    message: form.get("message") ?? "",
    contactEmail: form.get("contactEmail") ?? "",
    website: form.get("website") ?? "",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    if (errors.website) return { ok: true, message: "Obrigado! Seu relato foi recebido." }; // bots não recebem sinal
    return { ok: false, message: "Revise os campos destacados.", errors };
  }
  const limited = rateLimit(`report:${await clientFingerprint("report")}`, 5, 60 * 60 * 1000);
  if (!limited.ok) return { ok: false, message: "Muitos envios em pouco tempo. Tente novamente mais tarde." };

  await db.errorReport.create({
    data: { pageUrl: parsed.data.pageUrl, message: parsed.data.message, contactEmail: parsed.data.contactEmail || null },
  });
  return { ok: true, message: "Obrigado! Seu relato foi recebido e será analisado pela equipe editorial." };
}
