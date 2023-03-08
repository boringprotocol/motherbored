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

        <div className="mb-4">
          <button onClick={handleGenerateSnapshotName}>Generate Snapshot Name</button>
          {snapshotName && <div>Snapshot Name: {snapshotName}</div>}
        </div>
        <GetAccountsPeersSnapshot snapshot={snapshotName} />
        <GetAccountsSoftStakeSnapshot snapshot={snapshotName} />

        <p className='text-xs mt-4 p-6'>cron running metaboss and jq on ec2 creating https://metaboss-public-results.s3.amazonaws.com/nft-holders.json in metaboss-public-results s2 bucket</p>
        <GetAccountsNftLicenses snapshot={snapshotName} />
      </div>
    </LayoutAuthenticated>
  );
}
