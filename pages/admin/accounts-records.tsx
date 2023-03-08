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

        <hr />
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-lg">Manually Run Each Snapshot Function</h2>
          <p className="text-xs mt-6">Generate snapshot name for each of the following functions which must all take the same name and each of the three need to complete for that snapshot to be complete in the db.</p>

          <div className="mb-4">
            <button className='mt-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm' onClick={handleGenerateSnapshotName}>Generate Snapshot Name</button>
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
