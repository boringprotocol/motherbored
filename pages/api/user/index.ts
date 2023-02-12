import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, bio, image, publicProfile } = req.body;
  const wallet =
    typeof req.query.wallet === "string" ? req.query.wallet : undefined;

  if (!wallet) {
    res.status(400).json({ error: "wallet query parameter is required" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { wallet },
      data: { name, bio, image, publicProfile },
    });

    res.status(200).json({ user });
  } catch (error: any) {
    // lol whatever "unkown type" error
    res.status(500).json({ error: error.toString() });
  }
}
