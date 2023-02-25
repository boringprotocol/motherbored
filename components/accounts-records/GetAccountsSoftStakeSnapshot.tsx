import React, { useState } from "react";
import axios from "axios";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  snapshot: string;
}

const GetAccountsSoftStakeSnapshot = ({ snapshot }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    setIsUpdating(true);
    try {
      await axios.post("/api/accounts-records/soft-stake/", { snapshot });
      alert("Update successful");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-md">Update Records w/ $BOP Balance</h2>
      <h3 className="mb-4 text-sm">Soft Stake</h3>
      <input
        id="snapshot-input-2"
        type="text"
        value={snapshot}
        onChange={(e) => console.log(e.target.value)}
      />
      <div>
        <p className="text-xs mt-4">Update Accounts Record with name given above with the total $BOP held by each account record. We use this, among other things, to determine whether staking requirements are met at any given time a snapshot has occured. </p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            "GetAccountsSoftStakeSnapshot"
          )}
        </button>
      </div>
    </div>
  );
};

export default GetAccountsSoftStakeSnapshot;
