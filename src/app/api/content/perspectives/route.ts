import { getPerspectives } from "@/lib/content/queries";
import { json } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  const list = await getPerspectives();
  return json({ data: list.map(({ id: _id, ...p }) => p) });
}
