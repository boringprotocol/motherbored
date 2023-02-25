import { useState } from "react";

interface ShellData {
  [key: string]: any;
}

export default function ShellButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data, setData] = useState<ShellData | null>(null);

  const handleClick = async () => {
    setStatus("loading");
    try {
      // Trigger the API route for the shell script
      const res = await fetch("/api/accounts-records/nft-mint-list");

      if (!res.ok) {
        throw new Error("Failed to execute the shell script - metaboss!");
      }

      // Wait for the JSON files to be written to the file system
      const allData = await Promise.all([
        fetch("/data/nft-snapshot/6yTqWnnBjN6WqNRPHxUQQZ5Z2WBEYNPAqkCgm3akwfDX_holders.json").then((res) =>
          res.json()
        ),
        fetch("/data/nft-snapshot/5Z1zMQFhCd25UgTHf5iDKu3hxGujrQ3UZFM18zfRTmVN_holders.json").then((res) =>
          res.json()
        ),
        fetch("/data/nft-snapshot/9PyH3oZroZMEoX34vvfirD2L8GpLSQpYeFtRXBTA1HE3_holders.json").then((res) =>
          res.json()
        ),
      ]).then(([v1, v2, vx]) => {
        return { v1, v2, vx };
      });

      setData(allData);
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-md">Get NFT Mint List</h2>
      <p className="text-xs mt-4">Sanitize the "/data/nft-snapshot/combined.csv" by hand before running GetAccountNftLicensesSnapshot in the next step.</p>

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick} disabled={status === "loading"}>
        {status === "loading" ? "Loading..." : "GetAccountNftMintList"}
      </button>

      {status === "error" && <p>Failed to execute the shell script</p>}
      {status === "success" && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
