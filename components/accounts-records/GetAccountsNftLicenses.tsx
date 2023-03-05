import { useState } from "react";

interface Props {
  snapshot: string;
}

export const GetAccountsNftLicenses: React.FC<Props> = ({ snapshot }) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const response = await fetch("/api/accounts-records/nft-licenses", {
      method: "POST",
      body: JSON.stringify({ snapshot }),
    });
    if (response.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">

      <h2 className="text-md mb-4 ">Update Record w/ NFT Licenses</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          id="snapshot-input"
          value={snapshot}
          onChange={(event) => event.preventDefault()}
        />

        <p className="text-xs mt-4">Update Account Record with name given above, and add all NFT License data. </p>

        <div>
          <button className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            type="submit">GetAccountNftLicensesSnapshot</button>
          {status === "loading" && <p>Loading...</p>}
          {status === "success" && <p>Data updated successfully!</p>}
          {status === "error" && <p>There was an error updating the data.</p>}
        </div>

      </form>
    </div>
  );
};
