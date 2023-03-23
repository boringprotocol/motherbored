// pages/api/total-unclaimed-rewards/index.ts
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = await getSession({ req });

  if (!session || !session.user || !session.user.name) {
    res.status(403).json({ totalUnclaimedRewards: 0 });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { wallet: session.user.name },
    include: { Claim: true },
  });

  if (!user) {
    res.status(404).json({ totalUnclaimedRewards: 0 });
    return;
  }

  const totalUnclaimedRewards = user.Claim.reduce((acc, claim) => {
    if (!claim.claimed) {
      acc += claim.amount;
    }
    return acc;
  }, 0);

  const totalClaims = user.Claim.filter((claim) => !claim.claimed).length;

  res.status(200).json({ totalUnclaimedRewards, totalClaims });
}
