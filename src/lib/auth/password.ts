import "server-only";
import bcrypt from "bcryptjs";

const COST = 12;
/** Hash fixo usado quando o e-mail não existe, para igualar o tempo de resposta. */
const DUMMY_HASH = bcrypt.hashSync("dois-lados:dummy:nunca-usada", COST);

export const PASSWORD_MIN = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string | null | undefined) {
  const ok = await bcrypt.compare(plain, hash ?? DUMMY_HASH);
  return hash ? ok : false;
}
