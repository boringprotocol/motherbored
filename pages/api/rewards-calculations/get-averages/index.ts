import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { join } from "path";

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
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
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

  const walletNames = Object.keys(walletAverages);

  // Generate the CSV data
  const csvData = walletNames.map((wallet) => {
    const row: (number | string)[] = [];
    row.push(wallet);
    Object.keys(walletAverages[wallet]).forEach((key) => {
      row.push(
        walletAverages[wallet][
          key as keyof (typeof walletAverages)[typeof wallet]
        ] /
          accountHistories.filter(
            (accountHistory) => accountHistory.wallet === wallet
          ).length
      );
    });
    return row.join(",");
  });

  // Write the CSV file to disk
  const folderPath = join(
    process.cwd(),
    "public",
    "data",
    "rewards-calculations"
  );
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const filePath = join(folderPath, "averages.csv");
  fs.writeFileSync(filePath, csvData.join("\n"), { flag: "w" });

  res.status(200).json(walletAverages);
}
