import React, { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  snapshot: string;
}

const GetAccountsPeersSnapshot: React.FC<Props> = ({ snapshot }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    setIsUpdating(true);
    NProgress.start();
    try {
      await axios.post("/api/accounts-records/peers", { snapshot });
      alert("Update successful");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
    setIsUpdating(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">Create Accounts Record</h2>
        <input
          id="snapshot-input"
          type="text"
          value={snapshot}
          onChange={(e) => console.log(e)}
        />
        <div>
          <p className="text-xs mt-4">Create Account Record with name given above, and add all peer data. </p>

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
            disabled={isUpdating}>
            {isUpdating ? (<><FontAwesomeIcon icon={faSpinner} spin /></>
            ) : (
              "GetAccountsPeersSnapshot"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default GetAccountsPeersSnapshot;
