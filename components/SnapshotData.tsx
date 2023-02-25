import { useState, useEffect } from 'react';

type SnapshotCount = {
  totalCount: number;
  softStakeCount: number;
  softStakeCount12500: number;
  v1LicenseCount: number;
  v2LicenseCount: number;
  vxLicenseCount: number;
  providerCloudCount: number;
  providerLocalCount: number;
};

export default function SnapshotData() {
  const [snapshotData, setSnapshotData] = useState<SnapshotCount | null>(null);
  const [snapshotValues, setSnapshotValues] = useState<string[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>('');

  const [v1LicenseCount, setV1LicenseCount] = useState<number>(0);


  useEffect(() => {
    async function fetchSnapshotData() {
      try {
        const response = await fetch(`/api/account-records${selectedSnapshot ? `?snapshot=${selectedSnapshot}` : ''}`);

        console.log('selectedSnapshot:', selectedSnapshot);

        if (response.ok) {
          const data = await response.json();

          setSnapshotData(data);

          // fetch the count of rows meeting the v1_license condition
          const v1CountResponse = await fetch(`/api/account-records/count?v1_license=gt&snapshot=${selectedSnapshot}`);
          const v1CountData = await v1CountResponse.json();
          setV1LicenseCount(v1CountData);
        } else {
          console.error('Failed to fetch snapshot data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching snapshot data:', error);
      }
    }


    fetchSnapshotData();
  }, [selectedSnapshot]);

  useEffect(() => {
    async function fetchSnapshotValues() {
      try {
        const response = await fetch('/api/account-records?snapshots=true');

        if (response.ok) {
          const data = await response.json();

          setSnapshotValues(data);
        } else {
          console.error('Failed to fetch snapshot values:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching snapshot values:', error);
      }
    }

    fetchSnapshotValues();
  }, []);

  function handleSnapshotChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSnapshot(event.target.value);
  }

  return (
    <div className="p-12">
      <label>
        <select value={selectedSnapshot} onChange={handleSnapshotChange}>
          <option value="">Select a snapshot value</option>
          {snapshotValues.map((snapshot) => (
            <option key={snapshot} value={snapshot}>
              {snapshot}
            </option>
          ))}
        </select>
      </label>
      {snapshotData !== null ? (
        <div className="mt-6">
          <p>Total number of records: {snapshotData.totalCount}</p>
          <p>Number of records with soft_stake {'>'} 12500: {snapshotData.softStakeCount12500}</p>
          <p>Number of records with v1_license {'>'} 1: {v1LicenseCount}</p>

          <p>Number of records with soft_stake {'>'} 6250: {snapshotData.softStakeCount}</p>
          <p>Number of records with v1_license {'>'} 0: {snapshotData.v1LicenseCount}</p>
          <p>Number of records with v2_license {'>'} 0: {snapshotData.v2LicenseCount}</p>
          <p>Number of records with vx_license {'>'} 0: {snapshotData.vxLicenseCount}</p>
          <p>Number of records with provider_cloud {'>'} 0: {snapshotData.providerCloudCount}</p>
          <p>Number of records with provider_local {'>'} 0: {snapshotData.providerLocalCount}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

