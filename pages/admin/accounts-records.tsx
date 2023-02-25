import LayoutAuthenticated from '../../components/layoutAuthenticated';
import React, { useState } from 'react';
import GetAccountsPeersSnapshot from '../../components/accounts-records/GetAccountsPeersSnapshot';
import GetAccountsSoftStakeSnapshot from '../../components/accounts-records/GetAccountsSoftStakeSnapshot';
import GetAccountsNftMintList from '../../components/accounts-records/GetAccountsNftMintList';
import { GetAccountsNftLicenses } from '../../components/accounts-records/GetAccountsNftLicenses';

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
        <div className="mb-4">
          <button onClick={handleGenerateSnapshotName}>Generate Snapshot Name</button>
          {snapshotName && <div>Snapshot Name: {snapshotName}</div>}
        </div>
        <GetAccountsPeersSnapshot snapshot={snapshotName} />
        <GetAccountsSoftStakeSnapshot snapshot={snapshotName} />
        <GetAccountsNftMintList />
        <GetAccountsNftLicenses snapshot={snapshotName} />
      </div>
    </LayoutAuthenticated>
  );
}
