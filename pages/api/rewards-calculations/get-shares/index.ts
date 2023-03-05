import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface Wallet {
  [key: string]: number;
}

interface Wallets {
  [key: string]: Wallet;
}

interface AccountShare {
  shares: number;
  percentage: number;
  bop: number;
}

interface AccountShares {
  [key: string]: AccountShare;
}

const calculateAccountShares = (wallets: Wallets): AccountShares => {
  // Define the list of ignored fields
  const ignoredFields = ["soft_stake"];

  // Calculate the sum of each property
  const sum: Wallet = {};
  for (const wallet of Object.values(wallets)) {
    for (const [key, value] of Object.entries(wallet)) {
      if (!ignoredFields.includes(key)) {
        sum[key] = (sum[key] ?? 0) + value;
      }
    }
  }

  // Calculate the percentage of each wallet's share
  const totalTokens = 180000;
  const allAccountShares: number = Object.values(sum).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const accountShares: AccountShares = {};
  for (const [walletAddress, wallet] of Object.entries(wallets)) {
    const share: AccountShare = { shares: 0, percentage: 0, bop: 0 };
    for (const [key, value] of Object.entries(wallet)) {
      if (!ignoredFields.includes(key)) {
        share.shares += value;
      }
    }
    share.percentage = (share.shares / allAccountShares) * 100;
    share.bop = (share.percentage / 100) * totalTokens;
    accountShares[walletAddress] = share;
  }

  return accountShares;
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
    "applied-req-stake-filter.json"
  );

  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading applied-req-stake-filter.json");
      return;
    }

    const wallets: Wallets = JSON.parse(data).wallets;
    const accountShares = calculateAccountShares(wallets);
    const transformedJson = JSON.stringify({ wallets: accountShares });

    const outputFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "rewards-calculations",
      "account-shares.json"
    );

    fs.writeFile(outputFilePath, transformedJson, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error calculating account shares");
      } else {
        res.status(200).send("Account shares calculated successfully!");
      }
    });
  });
}
