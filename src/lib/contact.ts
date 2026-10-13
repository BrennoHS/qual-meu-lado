import "server-only";

/**
 * E-mail público de contato (anúncios, apoio, imprensa). Vem da variável de
 * ambiente CONTACT_EMAIL — muda na Vercel, sem mexer no código. O endereço é
 * entregue à página em duas partes e só é montado quando a pessoa clica,
 * o que dificulta a coleta por robôs de spam.
 */
export function contactEmailParts(): { user: string; domain: string } | null {
  const raw = (process.env.CONTACT_EMAIL ?? "").trim().toLowerCase();
  const m = raw.match(/^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/);
  return m ? { user: m[1], domain: m[2] } : null;
}
