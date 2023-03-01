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
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
            disabled={isCreatingCsv || isCsvCreated}
          >
            {isCreatingCsv ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Create CSV"
            )}
          </button>
          {isCsvCreated && (
            <div className="mt-4 text-green-600">
              CSV file created successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCsvButton;
