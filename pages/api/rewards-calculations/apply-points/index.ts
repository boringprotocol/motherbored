import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

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
  const csvFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "rewards-calculations",
    "averages.csv"
  );
  const wallets: Wallets = {};

  fs.createReadStream(csvFilePath)
    .pipe(csvParser({ headers: false }))
    .on("data", (data) => {
      const wallet = data[0];
      wallets[wallet] = {};
      for (let i = 1; i < Object.keys(data).length; i++) {
        const key = Object.keys(points)[i - 1];
        const value = Number(data[i]);
        const pointsValue = points[key];
        const multipliedValue = value * pointsValue;
        wallets[wallet][key] = multipliedValue.toFixed(9);
      }
    })
    .on("end", () => {
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
          res.status(500).send("Error multiplying averages.csv");
        } else {
          res.status(200).send("Multiplied averages.csv created successfully!");
        }
      });
    });
}
