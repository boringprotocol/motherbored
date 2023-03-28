// Run with: ts-node scripts/update-users.ts
// when we take the new shit live we need to update users to n3wb role

import prisma from "../lib/prisma";
import { User } from "@prisma/client";

async function main(): Promise<void> {
  const users: User[] = await prisma.user.findMany();
  console.log(`Updating ${users.length} user records`);

  const updatePromises = users.map((user) =>
    prisma.user.update({
      where: { id: user.id },
      data: { role: "n3wb" },
    })
  );

  await Promise.all(updatePromises);

  console.log("All user records updated");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
