import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user?.email && !session?.user?.name) {
    return res.status(400).json({ error: "Wallet address not found" });
  }

  const walletAddress = session.user.email ?? session.user.name ?? undefined;

  const claims = await prisma.claim.findMany({
    where: {
      user: {
        wallet: {
          equals: walletAddress,
        },
      },
    },
  });

  return res.status(200).json(claims);
}
