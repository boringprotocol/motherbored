import React, { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props { }

const GetSharesButton: React.FC<Props> = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleClick = async () => {
    setIsCalculating(true);
    NProgress.start();
    try {
      const response = await axios.post("/api/rewards-calculations/get-shares");
      if (response.status === 200) {
        setIsCalculated(true);
      } else {
        throw new Error(`Failed to calculate account shares: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsCalculating(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">GetShares</h2>
        <div>
          <button
            className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            onClick={handleClick}
            disabled={isCalculating || isCalculated}
          >
            {isCalculating ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Calculate Account Shares"
            )}
          </button>
          {isCalculated && (
            <div className="mt-4 text-green-600">
              Account shares calculated successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GetSharesButton;
