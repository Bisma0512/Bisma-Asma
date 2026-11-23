import { hashPassword, verifyPassword } from "better-auth/crypto";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@bismaasma.pk";
  const plain = "Admin123!ChangeMe";
  const password = await hashPassword(plain);

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: "Bisma Admin",
        email,
        emailVerified: true,
        role: Role.ADMIN,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: Role.ADMIN, emailVerified: true },
    });
  }

  await prisma.account.deleteMany({
    where: { userId: admin.id, providerId: "credential" },
  });
  await prisma.account.create({
    data: {
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password,
    },
  });

  const ok = await verifyPassword({ hash: password, password: plain });
  console.log("Admin fixed:", email, "verify=", ok);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
