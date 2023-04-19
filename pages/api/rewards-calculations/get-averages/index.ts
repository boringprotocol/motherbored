import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accountHistories = await prisma.accountHistory.findMany({
    select: {
      wallet: true,
      consumer_local: true,
      consumer_linux: true,
      consumer_windows: true,
      consumer_mac: true,
      provider_cloud: true,
      provider_local: true,
      v1_license: true,
      v2_license: true,
      vx_license: true,
      soft_stake: true,
      poa: true,
      timestamp: true,
    },
    where: {
      timestamp: {
        // from 14 days ago
        gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const walletAverages: Record<string, Record<string, number>> = {};

  accountHistories.forEach((accountHistory) => {
    const wallet = accountHistory.wallet as string;

    if (!walletAverages[wallet]) {
      walletAverages[wallet] = {
        consumer_local: 0,
        consumer_linux: 0,
        consumer_windows: 0,
        consumer_mac: 0,
        provider_cloud: 0,
        provider_local: 0,
        v1_license: 0,
        v2_license: 0,
        vx_license: 0,
        soft_stake: 0,
        poa: 0,
      };
    }

    Object.keys(walletAverages[wallet]).forEach((key) => {
      walletAverages[wallet][key] +=
        Number(accountHistory[key as keyof typeof accountHistory]) || 0;
    });
  });

  const data = Object.keys(walletAverages).map((wallet) => {
    const count = accountHistories.filter((h) => h.wallet === wallet).length;
    const averageValues: Record<string, number> = {};

    Object.keys(walletAverages[wallet]).forEach((key) => {
      averageValues[key] = walletAverages[wallet][key] / count;
    });

    return {
      wallet,
      ...averageValues,
    };
  });

  await prisma.$executeRaw`DELETE FROM AccountRecordsAverages`;
  await prisma.accountRecordsAverages.createMany({ data });

  res.status(200).json({ success: true });
}
