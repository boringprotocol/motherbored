import LayoutAuthenticated from '../../components/layoutAuthenticated';
import React, { useState } from 'react';
import GetAccountsPeersSnapshot from '../../components/accounts-records/GetAccountsPeersSnapshot';
import GetAccountsSoftStakeSnapshot from '../../components/accounts-records/GetAccountsSoftStakeSnapshot';
import { GetAccountsNftLicenses } from '../../components/accounts-records/GetAccountsNftLicenses';
import RunAllAccountsRecords from '../../components/accounts-records/RunAllAccountsRecords';

var generateSnapshotName = require('boring-name-generator');

export default function AccountRecords() {
  const [snapshotName, setSnapshotName] = useState("");

  const handleGenerateSnapshotName = () => {
    const name = generateSnapshotName({ words: 3 }).dashed;
    setSnapshotName(name);
  };

  return (
    <LayoutAuthenticated>
      <div className='p-12'>

        <RunAllAccountsRecords />

        <div className="card-bordered">
          <div className="card-body prose text-xs">
            <h2 className="text-sm">Manually Run Each Snapshot Function</h2>
            <p className="">Generate snapshot name for each of the following functions which must all take the same name and each of the three need to complete for that snapshot to be complete in the db.</p>

            <div className="">
              <button className='btn btn-outline btn-sm w-auto' onClick={handleGenerateSnapshotName}>Generate Snapshot Name</button>

            </div>
            {snapshotName && <div>Snapshot Name: {snapshotName}</div>}
          </div>

        </div>


        <GetAccountsPeersSnapshot snapshot={snapshotName} />
        <GetAccountsSoftStakeSnapshot snapshot={snapshotName} />

        <p className='text-xs mt-4 p-6'>cron running metaboss and jq on ec2 creating https://metaboss-public-results.s3.amazonaws.com/nft-holders.json in metaboss-public-results s2 bucket</p>
        <GetAccountsNftLicenses snapshot={snapshotName} />
      </div>
    </LayoutAuthenticated>
  );
}
