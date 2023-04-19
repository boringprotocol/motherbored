import EpochDisplay from "components/epoch";
import EpochLineChart from "components/EpochsUpdated";
import LayoutAuthenticated from "../../components/layoutAuthenticated";

export default function Epochs() {

  // points

  return (
    <LayoutAuthenticated>

      <div className="p-12">

        <EpochDisplay />
        <EpochLineChart />
      </div>

    </LayoutAuthenticated>
  );
}
