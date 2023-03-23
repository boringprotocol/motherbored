import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RunAllAccountsRecords: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const [endpointStatus, setEndpointStatus] = useState([
    { name: "Create snapshot...", status: "pending" },
    { name: "Gather Peer counts...", status: "pending" },
    { name: "Apply soft stake...", status: "pending" },
    { name: "Apply NFT licenses...", status: "pending" },
  ]);

  const handleClick = async () => {
    setIsUpdating(true);
    setEndpointStatus([
      { name: "Snapshot created", status: "in progress" },
      { name: "Peer records gathered", status: "in progress" },
      { name: "Soft stake applied", status: "in progress" },
      { name: "NFT licenses applied", status: "in progress" },
    ]);
    try {
      const response = await fetch("/api/accounts-records/run-all", {
        method: "POST",
      });
      if (response.ok) {
        setEndpointStatus([
          { name: "Snapshot created", status: "success" },
          { name: "Peer records gathered", status: "success" },
          { name: "Soft stake applied", status: "success" },
          { name: "NFT licenses applied", status: "success" },
        ]);
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
    <div className="card-bordered my-4">
      <div className="card-body prose text-xs">
        <h2 className="">Run All Snapshot Functions</h2>
        <p className="">Run everything at once. Snapshot name will be generated in the background. </p>

        <button
          className="btn btn-outline btn-sm w-auto"
          onClick={handleClick}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            "Run All Accounts Records"
          )}
        </button>
        <ul className="mt-4 list-disc list-inside p-4">
          {endpointStatus.map((endpoint) => (
            <li
              key={endpoint.name}
              className={`text-sm font-medium ${endpoint.status === "success"
                ? "text-green-500"
                : endpoint.status === "in progress"
                  ? "text-yellow-500"
                  : "text-red-500"
                }`}
            >
              {endpoint.name} {endpoint.status === "success" && "✅"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RunAllAccountsRecords;
