import LayoutAuthenticated from "../../components/layoutAuthenticated";
import ApplyFilters from "../../components/rewards-calculations/ApplyFilters";
import ApplyPointsButton from "../../components/rewards-calculations/ApplyPointsButton";
import AveragesButton from "../../components/rewards-calculations/AveragesButton";
import GetSharesButton from "../../components/rewards-calculations/GetSharesButton";

export default function RewardsCalculations() {

  // RewardsCalculations

  return (
    <LayoutAuthenticated>

      <div className="p-12">
        <AveragesButton />
        <ApplyFilters />
        <ApplyPointsButton />


        <GetSharesButton />
      </div>


    </LayoutAuthenticated>
  );
}
