import { getAffinityModel } from "@/lib/content/queries";
import { json } from "@/lib/api";

/** Apenas DEFINIÇÕES (dimensões e afirmações). Este servidor não recebe respostas. */
export async function GET() {
  return json({ data: await getAffinityModel() });
}
