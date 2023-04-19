import React, { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


interface Props { }

const UpdateAveragesButton: React.FC<Props> = () => {
  const [isUpdatingAverages, setIsUpdatingAverages] = useState(false);
  const [isAveragesUpdated, setIsAveragesUpdated] = useState(false);

  const handleClick = async () => {
    setIsUpdatingAverages(true);
    NProgress.start();
    try {
      const response = await axios.post("/api/rewards-calculations/get-averages");
      if (response.status === 200) {
        setIsAveragesUpdated(true);
      } else {
        throw new Error(`Failed to update averages: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsUpdatingAverages(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">Update Averages</h2>
        <div>
          <button
            className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            onClick={handleClick}
            disabled={isUpdatingAverages || isAveragesUpdated}
          >
            {isUpdatingAverages ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Update Averages"
            )}
          </button>
          {isAveragesUpdated && (
            <div className="mt-4 text-green-600">
              Averages updated successfully.
            </div>
          )}
        </div>
        <Link href="/api/rewards-calculations/download-averages">
          <a
            className="ml-4 my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            download
          >
            Download CSV
          </a>
        </Link>

      </div>
    </>
  );
};

export default UpdateAveragesButton;
