// /api/peer-profile/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Peer } from "../../../types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Peer | { error: string }>
) {
  const { id } = req.query;
  const peer = await prisma.peer.findUnique({
    where: {
      id: id as string,
    },
  });

  console.log(peer);

  if (!peer) {
    return res.status(404).json({ error: "Peer not found" });
  }

  return res.status(200).json(peer);
}
