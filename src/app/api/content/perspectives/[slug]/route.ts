import { getPerspective } from "@/lib/content/queries";
import { badRequest, json, notFoundJson, slugParam } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugParam.safeParse(slug).success) return badRequest();
  const p = await getPerspective(slug);
  if (!p) return notFoundJson();
  const { id: _id, ...rest } = p;
  return json({ data: rest });
}
