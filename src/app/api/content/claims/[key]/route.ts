import { getClaim } from "@/lib/content/queries";
import { badRequest, json, notFoundJson, slugParam } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!slugParam.safeParse(key).success) return badRequest();
  const c = await getClaim(key);
  return c ? json({ data: c }) : notFoundJson();
}
