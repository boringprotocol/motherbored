import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

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
  const averagesFilePath = path.join(
    process.cwd(),
    "tmp/rewards-calculations/averages.json"
  );
  const wallets: Wallets = JSON.parse(
    fs.readFileSync(averagesFilePath, { encoding: "utf-8" })
  ).wallets;

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
