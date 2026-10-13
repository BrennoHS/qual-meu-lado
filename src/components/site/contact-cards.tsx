import Link from "next/link";
import { Building2, Megaphone, Newspaper } from "lucide-react";
import { contactEmailParts } from "@/lib/contact";
import { ContactEmail } from "./contact-email";
import { AdvertiseDialog } from "@/components/advertise/advertise-form";

const CARDS = [
  { icon: Building2, title: "Apoiar ou anunciar", text: "Apoio institucional sinalizado, sem propaganda política e sem rastreamento.", subject: "Apoio ao DOIS LADOS" },
  { icon: Newspaper, title: "Imprensa e escolas", text: "Entrevistas, uso em sala de aula, licenciamento educativo.", subject: "Imprensa / educação — DOIS LADOS" },
  { icon: Megaphone, title: "Sugestões e parcerias", text: "Ideias de conteúdo, parcerias com checadores e projetos cívicos.", subject: "Parceria — DOIS LADOS" },
];

/** Canais de contato (anunciantes, imprensa, parceiros). Sem e-mail configurado, aponta para o formulário. */
export function ContactCards({ compact = false }: { compact?: boolean }) {
  const parts = contactEmailParts();
  return (
    <section aria-labelledby="fale" className={compact ? "mt-12 border-t border-line pt-10" : ""}>
      <h2 id="fale" className="h-section">{compact ? "Quer apoiar?" : "Fale com a gente"}</h2>
      {!compact && (
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={`card flex flex-col p-5 ${i === 0 ? "border-paper/40" : ""}`}>
              <Icon aria-hidden className="h-5 w-5 text-paper/80" />
              <p className="mt-3 font-display text-lg">{title}</p>
              <p className="mt-1 text-sm text-paper/75">{text}</p>
              {i === 0 && (
                <AdvertiseDialog className="btn btn-solid mt-4 self-start">Quero anunciar</AdvertiseDialog>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        {parts ? (
          <>
            <p className="mb-4 text-paper/80">Escreva para a equipe — todas as mensagens são lidas.</p>
            <ContactEmail user={parts.user} domain={parts.domain} subject={compact ? CARDS[0].subject : undefined} />
          </>
        ) : (
          <p className="text-paper/80">
            Use o <Link href="/contato#formulario" className="link-u text-paper">formulário de contato</Link> e escreva “apoio”, “imprensa” ou “parceria” no início da mensagem.
          </p>
        )}
      </div>
    </section>
  );
}
