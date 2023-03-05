
import DisplayRewardsPoints from "../../components/DisplayRewardsPoints";
import EditRewardsPoints from "../../components/EditRewardsPoints";
import LayoutAuthenticated from "../../components/layoutAuthenticated";

export default function points() {

  // points

  return (
    <LayoutAuthenticated>

      <div className="p-12">

        <DisplayRewardsPoints />
        <EditRewardsPoints />
      </div>

    </LayoutAuthenticated>
  );
}
