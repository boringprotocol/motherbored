import fetch from "node-fetch";
import generateSnapshotName from "boring-name-generator";

async function runAccountsRecords() {
  const snapshotName = generateSnapshotName({ words: 3 }).dashed;

  console.log("Generated snapshot name:", snapshotName);

  const endpoints = [
    {
      name: "Accounts Peers Snapshot",
      path: "/api/accounts-records/peers",
    },
    {
      name: "Accounts Soft Stake Snapshot",
      path: "/api/accounts-records/soft-stake",
    },
    {
      name: "Accounts NFT Licenses Snapshot",
      path: "/api/accounts-records/nft-licenses",
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

runAccountsRecords();
