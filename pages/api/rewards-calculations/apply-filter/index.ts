import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const averagesFilePath = path.join(
  process.cwd(),
  "public/data/rewards-calculations/applied-req-stake-filter.json"
);

interface Wallet {
  consumer_local: number;
  consumer_linux: number;
  consumer_windows: number;
  consumer_mac: number;
  provider_cloud: number;
  provider_local: number;
  v1_license: number;
  v2_license: number;
  vx_license: number;
  bop_balance: number;
  poa: number;
}

interface Wallets {
  [address: string]: Wallet;
}

interface Output {
  wallets: Wallets;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Read the data from averages.json
  const data: Output = JSON.parse(fs.readFileSync(averagesFilePath, "utf8"));

  // Calculate the total number of peers
  const totalPeers =
    Object.values(data.wallets).reduce(
      (sum, wallet) => sum + wallet.provider_local + wallet.provider_cloud,
      0
    ) || 1; // add 1 as the default value if there are no wallets in the data

  // Initialize counters for the number of v1 and v2 licenses added
  let v1Added = 0;
  let v2Added = 0;

  // Apply the filters
  const filteredData: Output = {
    wallets: Object.keys(data.wallets).reduce((wallets, walletAddress) => {
      const wallet = data.wallets[walletAddress];
      wallets[walletAddress] = wallet;

      // Check if there are any v1 licenses to add
      let v1AddedPerWallet = 0;
      if (wallet.v1_license > 0 && v1Added < totalPeers) {
        v1AddedPerWallet = Math.min(
          totalPeers - v1Added,
          Math.floor(wallet.v1_license)
        );
        v1Added += v1AddedPerWallet;
      }

      // Check if there are any v2 licenses to add
      let v2AddedPerWallet = 0;
      if (wallet.v2_license > 0 && v2Added < totalPeers) {
        v2AddedPerWallet = Math.min(
          totalPeers - v2Added,
          Math.floor(wallet.v2_license)
        );
        v2Added += v2AddedPerWallet;
      }

      // Add the licenses to the appropriate fields
      if (v1AddedPerWallet > 0) {
        if (wallet.provider_local >= 1) {
          wallets[walletAddress].provider_local += v1AddedPerWallet * 0.5;
        } else if (wallet.provider_cloud >= 1) {
          wallets[walletAddress].provider_cloud += v1AddedPerWallet * 0.5;
        }
      }

      if (v2AddedPerWallet > 0) {
        if (wallet.provider_local >= 1) {
          wallets[walletAddress].provider_local += v2AddedPerWallet * 0.25;
        } else if (wallet.provider_cloud >= 1) {
          wallets[walletAddress].provider_cloud += v2AddedPerWallet * 0.25;
        }
      }

      return wallets;
    }, {}),
  };

  // Write the filtered data to a file
  const outputPath = path.join(
    process.cwd(),
    "public/data/rewards-calculations/applied-filters.json"
  );
  fs.writeFile(outputPath, JSON.stringify(filteredData, null, 2), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to write filtered data to file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applied-filters.json"'
      );
      res.send(JSON.stringify(filteredData, null, 2));
    }
  });
}
