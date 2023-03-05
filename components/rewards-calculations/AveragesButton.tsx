import React, { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props { }

const CreateCsvButton: React.FC<Props> = () => {
  const [isCreatingCsv, setIsCreatingCsv] = useState(false);
  const [isCsvCreated, setIsCsvCreated] = useState(false);

  const handleClick = async () => {
    setIsCreatingCsv(true);
    NProgress.start();
    try {
      const response = await axios.post("/api/rewards-calculations/get-averages");
      if (response.status === 200) {
        setIsCsvCreated(true);
      } else {
        throw new Error(`Failed to create CSV file: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsCreatingCsv(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">GetAverages</h2>
        <div>
          <button
            className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            onClick={handleClick}
            disabled={isCreatingCsv || isCsvCreated}
          >
            {isCreatingCsv ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Create JSON"
            )}
          </button>
          {isCsvCreated && (
            <div className="mt-4 text-green-600">
              JSON file created successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCsvButton;
