import { getChapterBundle } from "@/lib/content/queries";
import { badRequest, json, notFoundJson, slugParam } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ lado: string; capitulo: string }> }) {
  const { lado, capitulo } = await params;
  if (!slugParam.safeParse(lado).success || !slugParam.safeParse(capitulo).success) return badRequest();
  const b = await getChapterBundle(lado, capitulo);
  if (!b) return notFoundJson();
  return json({ data: { perspective: b.perspective, chapter: { ...b.chapter, id: undefined, perspectiveId: undefined }, claims: b.claims } });
}
