// /api/update-user-image.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean }>
) {
  const { wallet, imageUrl } = req.body;

  try {
    await prisma.user.update({
      where: {
        wallet: wallet,
      },
      data: {
        image: imageUrl,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user image:", error);
    res.status(500).json({ success: false });
  }
}
