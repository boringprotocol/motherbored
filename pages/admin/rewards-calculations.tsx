import LayoutAuthenticated from "../../components/layoutAuthenticated";
import ApplyFilters from "../../components/rewards-calculations/ApplyFilters";
import ApplyPointsButton from "../../components/rewards-calculations/ApplyPointsButton";
import ApplyReqStakeFilter from "../../components/rewards-calculations/ApplyReqStakeFilter";
import AveragesButton from "../../components/rewards-calculations/AveragesButton";
import GetSharesButton from "../../components/rewards-calculations/GetSharesButton";
import AccountRecordsAveragesCsv from "../../components/AccountRecordsAveragesCsv";

export default function RewardsCalculations() {

  // RewardsCalculations

  return (
    <LayoutAuthenticated>

      <div className="p-12">
        <AccountRecordsAveragesCsv />
        <AveragesButton />
        <ApplyReqStakeFilter />
        <ApplyFilters />
        <ApplyPointsButton />
        <GetSharesButton />
      </div>


    </LayoutAuthenticated>
  );
}
