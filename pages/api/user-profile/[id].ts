import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { User } from "../../../types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  const { id } = req.query;
  console.log(id);

  const user = await prisma.user.findUnique({
    where: {
      id: id as string,
    },
  });

  console.log(user);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.publicProfile) {
    return res.status(403).json({ error: "User profile is private" });
  }

  return res.status(200).json(user);
}
