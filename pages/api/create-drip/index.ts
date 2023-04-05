// /page/api/create-drip/index.ts
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.name) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  const {
    name,
    description,
    tokenMintAddress,
    tokenDecimals,
    startDate,
    endDate,
  } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { wallet: session.user.name },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newDrip = await prisma.drip.create({
      data: {
        name,
        description,
        tokenMintAddress,
        tokenDecimals: parseInt(tokenDecimals),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: user.id,
      },
    });

    res.status(201).json(newDrip);
  } catch (error) {
    console.error("Error creating drip:", error);
    res.status(500).json({
      error: `An error occurred while creating the drip. ${error.message}`,
    });
  }
}
