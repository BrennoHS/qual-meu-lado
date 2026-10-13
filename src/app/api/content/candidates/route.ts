import { getCurrentElection } from "@/lib/content/queries";
import { json } from "@/lib/api";

export async function GET() {
  const e = await getCurrentElection();
  return json({
    data: e
      ? { election: { slug: e.slug, year: e.year, label: e.label }, candidates: e.candidates.map((c) => ({ slug: c.slug, ballotName: c.ballotName, party: c.party, partyAcronym: c.partyAcronym, office: c.office, isDemo: c.isDemo, proposals: c.proposals.length })) }
      : null,
  });
}
