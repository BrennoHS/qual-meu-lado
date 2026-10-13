"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { INTERESTS, type Interest } from "@/lib/advertise";
import { clientFingerprint, rateLimit } from "@/lib/security/rate-limit";

export type AdvertiseState = { ok: boolean; message: string; errors?: Record<string, string> };


const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  org: z.string().trim().max(160).default(""),
  email: z.string().trim().email("E-mail inválido.").max(200),
  phone: z.string().trim().max(40).default(""),
  interest: z.enum(Object.keys(INTERESTS) as [Interest, ...Interest[]], { errorMap: () => ({ message: "Escolha um assunto." }) }),
  message: z.string().trim().min(10, "Conte um pouco mais (mín. 10 caracteres).").max(4000, "Máximo de 4.000 caracteres."),
  consent: z.literal("on", { errorMap: () => ({ message: "Precisamos da sua autorização para responder." }) }),
  website: z.string().max(0).optional(), // honeypot: deve ficar vazio
});

/**
 * Contato comercial (anúncio/apoio). Envia direto para CONTACT_EMAIL, com
 * "responder" indo para quem escreveu. Se o envio não estiver configurado
 * ou falhar, guarda a mensagem no painel (Relatos) para não perder o contato.
 * Partidos, candidaturas e governos em campanha não podem anunciar (ver /apoie).
 */
export async function submitAdvertise(_: AdvertiseState, form: FormData): Promise<AdvertiseState> {
  const parsed = schema.safeParse({
    name: form.get("name") ?? "",
    org: form.get("org") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    interest: form.get("interest") ?? "",
    message: form.get("message") ?? "",
    consent: form.get("consent") ?? "",
    website: form.get("website") ?? "",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    if (errors.website) return { ok: true, message: "Mensagem enviada!" }; // robôs não recebem sinal
    return { ok: false, message: "Revise os campos destacados.", errors };
  }
  const limited = rateLimit(`advertise:${await clientFingerprint("advertise")}`, 4, 60 * 60 * 1000);
  if (!limited.ok) return { ok: false, message: "Muitos envios em pouco tempo. Tente novamente mais tarde." };

  const d = parsed.data;
  const text = [
    `Novo contato pelo site — ${INTERESTS[d.interest]}`,
    "",
    `Nome: ${d.name}`,
    `Organização: ${d.org || "—"}`,
    `E-mail: ${d.email}`,
    `Telefone: ${d.phone || "—"}`,
    "",
    "Mensagem:",
    d.message,
    "",
    "— Enviado pelo formulário de anúncios do DOIS LADOS. Responda este e-mail para falar direto com a pessoa.",
  ].join("\n");

  const sent = await sendMail({ subject: `[${INTERESTS[d.interest]}] ${d.org || d.name}`, text, replyTo: d.email });
  if (!sent.ok) {
    // Fallback: não perde o contato — aparece em /admin → Relatos.
    await db.errorReport.create({ data: { pageUrl: "/anuncie", message: `[ANÚNCIO] ${text}`.slice(0, 4000), contactEmail: d.email } });
  }
  return { ok: true, message: "Mensagem enviada! A equipe vai responder no e-mail que você informou." };
}
