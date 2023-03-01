import { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplyFilters = () => {
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const handleClick = async () => {
    console.log("Applying filters...");
    setIsApplyingFilters(true);
    NProgress.start();
    try {
      const response = await axios.get("/api/rewards-calculations/apply-filter");
      if (response.status === 200) {
        console.log("Filters applied successfully.");
        setIsFiltersApplied(true);
      } else {
        throw new Error(`Failed to apply filters: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsApplyingFilters(false);
    NProgress.done();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="mb-4 text-md">Apply Filters</h2>
        <div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
            disabled={isApplyingFilters || isFiltersApplied}
          >
            {isApplyingFilters ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Apply Filters"
            )}
          </button>
          {isFiltersApplied && (
            <div className="mt-4 text-green-600">
              Filters applied successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplyFilters;
