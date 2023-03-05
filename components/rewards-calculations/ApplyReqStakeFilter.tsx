import { useState } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplyReqStakeFilter = () => {
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const handleClick = async () => {
    console.log("Applying filters...");
    setIsApplyingFilters(true);
    NProgress.start();
    try {
      const response = await axios.get("/api/rewards-calculations/apply-req-stake-filter");
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
        <h2 className="mb-4 text-md">Apply Req Stake Filter</h2>
        <div>
          <button
            className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            onClick={handleClick}
            disabled={isApplyingFilters || isFiltersApplied}
          >
            {isApplyingFilters ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Apply Req Stake Filter"
            )}
          </button>
          {isFiltersApplied && (
            <div className="mt-4 text-green-600">
              Req Stake Filter applied successfully.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplyReqStakeFilter;
