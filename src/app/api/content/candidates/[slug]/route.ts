import { getCandidate } from "@/lib/content/queries";
import { badRequest, json, notFoundJson, slugParam } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugParam.safeParse(slug).success) return badRequest();
  const c = await getCandidate(slug);
  if (!c) return notFoundJson();
  return json({ data: c });
}
