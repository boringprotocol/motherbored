// /pages/api/drip/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dripId = req.query.id as string;

  try {
    const drip = await prisma.drip.findUnique({
      where: { id: dripId },
      include: {
        user: true,
      },
    });

    if (!drip) {
      return res.status(404).json({ error: "Drip not found" });
    }

    res.status(200).json(drip);
  } catch (error) {
    console.error("Error retrieving drip:", error);
    res.status(500).json({
      error: `An error occurred while retrieving the drip. ${error.message}`,
    });
  }
}
