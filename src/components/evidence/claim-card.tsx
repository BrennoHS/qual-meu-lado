import type { ClaimView } from "@/lib/content/queries";
import { evidenceKindForClaim } from "@/lib/labels";
import { EvidenceBadge } from "./evidence-badge";
import { SourceButton } from "./source-panel";

export function ClaimCard({ claim, claimKey }: { claim?: ClaimView; claimKey: string }) {
  if (!claim) {
    // Afirmação referenciada, mas não publicada: nunca exibimos o texto como fato.
    return (
      <div className="border border-dashed border-line p-5">
        <EvidenceBadge kind="unconfirmed" />
        <p className="mt-3 text-sm text-ash">Informação em apuração ({claimKey}). Ela será exibida quando for verificada.</p>
      </div>
    );
  }
  return (
    <figure className="relative border-l-2 border-[var(--accent)] bg-graphite-2/60 py-5 pl-5 pr-4 md:pl-7">
      <EvidenceBadge kind={evidenceKindForClaim(claim.type, claim.status)} />
      <blockquote className="mt-3 font-display text-lg leading-snug md:text-xl">{claim.text}</blockquote>
      <figcaption className="mt-3">
        <SourceButton claim={claim} />
      </figcaption>
    </figure>
  );
}
