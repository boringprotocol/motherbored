import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.claim.create({
    data: {
      amount: 10,
      claimed: false,
      wallet: "CojKKtJMg94Gx75NG4sPpVLngZDtLG9KHNfrg2Liqzu3",
      user: {
        connect: { wallet: "user_wallet" },
      },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
