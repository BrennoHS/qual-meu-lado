import "server-only";

/**
 * Envio de e-mail transacional (formulário de anúncio) via Resend (API HTTP,
 * sem SDK). Configuração por variáveis de ambiente:
 *   RESEND_API_KEY  chave da API (resend.com → API Keys)
 *   MAIL_FROM       remetente verificado, ex.: "DOIS LADOS <site@qualmeulado.com.br>"
 *   CONTACT_EMAIL   destino das mensagens, ex.: contato@qualmeulado.com.br
 * Sem configuração, `sendMail` devolve { ok: false } e quem chama guarda a
 * mensagem no painel — nenhum contato se perde.
 */
export type MailResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export function mailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.CONTACT_EMAIL);
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendMail({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }): Promise<MailResult> {
  if (!mailConfigured()) return { ok: false, reason: "not_configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [process.env.CONTACT_EMAIL],
        subject: oneLine(subject),
        text,
        html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;font-size:15px;line-height:1.5">${escapeHtml(text)}</pre>`,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
