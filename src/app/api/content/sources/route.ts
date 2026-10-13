import { getSources } from "@/lib/content/queries";
import { json } from "@/lib/api";

export async function GET() {
  const list = await getSources();
  return json({ data: list.map(({ id: _id, ...s }) => s) });
}
