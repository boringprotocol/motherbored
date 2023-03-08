import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { snapshot } = req.body;

  interface NftHolder {
    owner_wallet: string;
    v1: number;
    v2: number;
    vx: number;
  }

  const data = await fetch(
    "https://metaboss-public-results.s3.amazonaws.com/nft-holders.json"
  );
  const rows = (await data.json()) as NftHolder[];

  const promises = rows.map(async (row) => {
    const { owner_wallet, v1, v2, vx } = row;
    const updateResult = await prisma.accountHistory.updateMany({
      where: { wallet: owner_wallet, snapshot },
      data: {
        v1_license: Number(v1),
        v2_license: Number(v2),
        vx_license: Number(vx),
      },
    });
    return updateResult.count;
  });

  const results = await Promise.all(promises);
  const count = results.reduce((acc, val) => acc + val, 0);

  res.status(200).json({ count });
}
