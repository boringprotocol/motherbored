import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface Points {
  [key: string]: number;
}

interface Wallet {
  [key: string]: number | null;
}

interface Wallets {
  [key: string]: Wallet;
}

const points: Points = {
  consumer_local: 1,
  consumer_linux: 4,
  consumer_windows: 4,
  consumer_mac: 4,
  provider_cloud: 16,
  provider_local: 11,
  v1_license: 3,
  v2_license: 2,
  vx_license: 1,
  bop_balance: 1,
  poa: 3,
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "rewards-calculations",
    "applied-filters.json"
  );
  const wallets: Wallets = {};

  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

    Object.keys(jsonData.wallets).forEach((wallet) => {
      wallets[wallet] = {};
      const walletData = jsonData.wallets[wallet];
      Object.keys(walletData).forEach((key) => {
        const value = Number(walletData[key]);
        const pointsValue = points[key];
        const multipliedValue = value * pointsValue;
        wallets[wallet][key] = multipliedValue.toFixed(9);
      });
    });

    const outputFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "rewards-calculations",
      "applied-points.json"
    );
    const transformedJson = JSON.stringify({ wallets });

    fs.writeFile(outputFilePath, transformedJson, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error multiplying averages.json");
      } else {
        res.status(200).send("Multiplied averages.json created successfully!");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading averages.json");
  }
}
