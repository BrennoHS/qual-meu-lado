/**
 * Cria (ou reativa) uma conta administrativa sem expor a senha no histórico do shell.
 * Uso: npm run admin:create -- email@dominio "Nome"   (a senha é pedida no terminal)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const db = new PrismaClient();

async function main() {
  const [email, name = "Administração"] = process.argv.slice(2);
  if (!email || !email.includes("@")) throw new Error("Informe o e-mail: npm run admin:create -- email@dominio \"Nome\"");
  const rl = createInterface({ input: stdin, output: stdout });
  const password = await rl.question("Senha (mín. 12 caracteres): ");
  rl.close();
  if (password.length < 12) throw new Error("Senha curta demais.");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, role: "ADMIN", active: true },
    create: { email: email.toLowerCase(), name, passwordHash, role: "ADMIN" },
  });
  await db.auditLog.create({ data: { action: "user.create", summary: `Conta administrativa ${user.email} criada/atualizada via script`, entityType: "user", entityId: user.id } });
  console.log(`✓ Administrador(a) ${user.email} pronto(a).`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
