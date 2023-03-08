import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RunAllAccountsRecords: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/accounts-records/run-all", {
        method: "POST",
      });
      if (response.ok) {
        alert("All endpoints completed successfully");
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
    setIsUpdating(false);
  };

  return (
    <button
      className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
      onClick={handleClick}
      disabled={isUpdating}
    >
      {isUpdating ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : (
        "Run All Accounts Records"
      )}
    </button>
  );
};

export default RunAllAccountsRecords;
