import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface Wallet {
  provider_cloud: number;
  provider_local: number;
  soft_stake: number;
}

interface Wallets {
  [address: string]: Wallet;
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const wallets: Wallets = {};
  const accountRecordAverages = await prisma.accountRecordsAverages.findMany({
    select: {
      wallet: true,
      provider_cloud: true,
      provider_local: true,
      soft_stake: true,
    },
  });

  accountRecordAverages.forEach((average) => {
    wallets[average.wallet] = {
      provider_cloud: average.provider_cloud,
      provider_local: average.provider_local,
      soft_stake: average.soft_stake,
    };
  });

  Object.values(wallets).forEach((wallet) => {
    const softStake = Math.floor(wallet.soft_stake / 6250);
    const totalProviderValues =
      Math.floor(wallet.provider_local) + Math.floor(wallet.provider_cloud);
    if (totalProviderValues > softStake) {
      wallet.provider_local = Math.max(
        0,
        Math.floor(wallet.provider_local) - (totalProviderValues - softStake)
      );
      wallet.provider_cloud = Math.max(
        0,
        Math.floor(wallet.provider_cloud) - (totalProviderValues - softStake)
      );
    }
  });

  // Write the updated data to a file
  const outputPath = path.join(
    process.cwd(),
    "tmp/rewards-calculations/applied-req-stake-filter.json"
  );
  fs.writeFile(outputPath, JSON.stringify({ wallets }, null, 2), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to write updated data to file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applied-req-stake-filter.json"'
      );
      res.send(JSON.stringify({ wallets }, null, 2));
    }
  });
}
