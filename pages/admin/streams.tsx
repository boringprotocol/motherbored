import AverageAccountRecords from "../../components/AverageAccountRecords";
import LayoutAuthenticated from "../../components/layoutAuthenticated";
import SnapshotData from "../../components/SnapshotData";

export default function streams() {

  // streams

  return (
    <LayoutAuthenticated>

      <div className="p-12">
        Account Health: by account-records snapshots
        <p></p>
      </div>

      <SnapshotData />
      {/* <AverageAccountRecords /> */}

    </LayoutAuthenticated>
  );
}
