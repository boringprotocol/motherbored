import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const wallet = req.query.wallet as string;

    if (!wallet) {
      res.status(400).json({ error: "Missing wallet parameter" });
      return;
    }

    const userClaim = await prisma.claim.findFirst({
      where: {
        wallet: wallet,
        claimed: false,
      },
    });

    console.log(userClaim);

    if (userClaim) {
      res.json(userClaim);
    } else {
      res.status(404).json({ error: "No claim found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
