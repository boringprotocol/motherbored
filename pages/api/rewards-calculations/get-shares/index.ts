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
}

interface AccountShares {
  [key: string]: AccountShare;
}

const calculateAccountShares = (wallets: Wallets): AccountShares => {
  // Define the list of ignored fields
  const ignoredFields = ["bop_balance"];

  // Calculate the sum of each property
  const sum: AccountShare = {
    consumer_local: 0,
    consumer_linux: 0,
    consumer_windows: 0,
    consumer_mac: 0,
    provider_cloud: 0,
    provider_local: 0,
    v1_license: 0,
    v2_license: 0,
    vx_license: 0,
    poa: 0,
  };
  for (const wallet of Object.values(wallets)) {
    for (const [key, value] of Object.entries(wallet)) {
      if (!ignoredFields.includes(key)) {
        sum[key] += Number(value);
      }
    }
  }

  // Calculate the percentage of each wallet's share
  const allAccountShares: number = Object.values(sum).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const accountShares: AccountShares = {};
  for (const [walletAddress, wallet] of Object.entries(wallets)) {
    const share: AccountShare = {};
    let walletSum = 0;
    for (const [key, value] of Object.entries(wallet)) {
      if (!ignoredFields.includes(key)) {
        const fieldValue = Number(value);
        walletSum += fieldValue;
        share[key] = (fieldValue / allAccountShares) * 1000;
      }
    }
    accountShares[walletAddress] = {
      shares: walletSum,
      percentage: (walletSum / allAccountShares) * 100,
    };
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
    "applied-points.json"
  );

  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading applied-points.json");
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
