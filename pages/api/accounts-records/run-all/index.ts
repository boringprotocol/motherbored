import { NextApiResponse } from "next";
import generateSnapshotName from "boring-name-generator";
import fetch from "node-fetch";

async function runAccountsRecords() {
  const snapshotName = generateSnapshotName({ words: 3 }).dashed;

  console.log("Generated snapshot name:", snapshotName);

  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL_PROD
      : process.env.NEXT_PUBLIC_BASE_URL_DEV;

  const endpoints = [
    {
      name: "Accounts Peers Snapshot",
      path: `${baseURL}/api/accounts-records/peers`,
    },
    {
      name: "Accounts Soft Stake Snapshot",
      path: `${baseURL}/api/accounts-records/soft-stake`,
    },
    {
      name: "Accounts NFT Licenses Snapshot",
      path: `${baseURL}/api/accounts-records/nft-licenses`,
    },
  ];

  for (const endpoint of endpoints) {
    console.log(`Running ${endpoint.name}`);

    const response = await fetch(endpoint.path, {
      method: "POST",
      body: JSON.stringify({ snapshot: snapshotName }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to run ${endpoint.name}: ${response.statusText}`);
    }

    console.log(`${endpoint.name} completed successfully`);
  }

  console.log("All endpoints completed successfully");
}

export default async function handler(_req: any, res: NextApiResponse) {
  try {
    await runAccountsRecords();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
