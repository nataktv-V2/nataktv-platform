import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { id: "cmmqg5jzj0001krvoga9y4p87" },
    data: { role: "ADMIN" },
  });
  console.log(`Set ${user.displayName} (${user.email}) to ADMIN`);
  await prisma.$disconnect();
}

main();
