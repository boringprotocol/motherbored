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
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit">GetAccountNftLicensesSnapshot</button>
          {status === "loading" && <p>Loading...</p>}
          {status === "success" && <p>Data updated successfully!</p>}
          {status === "error" && <p>There was an error updating the data.</p>}
        </div>

      </form>
    </div>
  );
};
