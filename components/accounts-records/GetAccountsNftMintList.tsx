import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ShellData {
  [key: string]: any;
}

export default function ShellButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ShellData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setError(() => "Failed to execute the shell script");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-md">Get  NFT Mint List</h2>

      <button
        className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Loading...
            <FontAwesomeIcon icon={faSpinner} spin />
          </>
        ) : (
          "GetAccountNftMintList"
        )}
      </button>

      {error && <p>{error}</p>}

      {data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
