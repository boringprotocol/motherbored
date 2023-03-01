import React, { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props { }

const ApplyPointsButton: React.FC<Props> = () => {
  const [isApplyingPoints, setIsApplyingPoints] = useState(false);
  const [isPointsApplied, setIsPointsApplied] = useState(false);

  const handleClick = async () => {
    console.log("Applying points...");
    setIsApplyingPoints(true);
    NProgress.start();
    try {
      const response = await axios.get("/api/rewards-calculations/apply-points");
      if (response.status === 200) {
        console.log("Points applied successfully.");
        setIsPointsApplied(true);
      } else {
        throw new Error(`Failed to apply points: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsApplyingPoints(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">Apply Points</h2>
        <div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
            disabled={isApplyingPoints || isPointsApplied}
          >
            {isApplyingPoints ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Apply Points"
            )}
          </button>
          {isPointsApplied && (
            <div className="mt-4 text-green-600">
              Points applied successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplyPointsButton;
