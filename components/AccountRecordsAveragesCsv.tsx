import { useState } from 'react';

function AccountRecordsAveragesCsv() {
  const [csvData, setCsvData] = useState<string | null>(null);

  const downloadCsv = async () => {
    const response = await fetch('/api/account-records-averages');
    const accounts = await response.json();
    const csvContent = `data:text/csv;charset=utf-8,${[
      'wallet',
      'consumer_local',
      'consumer_linux',
      'consumer_windows',
      'consumer_mac',
      'provider_cloud',
      'provider_local',
      'v1_license',
      'v2_license',
      'vx_license',
      'soft_stake',
      'poa',
      'timestamp'
    ].join(',')}\n${accounts
      .map(
        (account: { wallet: any; consumer_local: any; consumer_linux: any; consumer_windows: any; consumer_mac: any; provider_cloud: any; provider_local: any; v1_license: any; v2_license: any; vx_license: any; soft_stake: any; poa: any; timestamp: any; }) =>
          `${account.wallet},${account.consumer_local},${account.consumer_linux},${account.consumer_windows},${account.consumer_mac},${account.provider_cloud},${account.provider_local},${account.v1_license},${account.v2_license},${account.vx_license},${account.soft_stake},${account.poa},${account.timestamp}`
      )
      .join('\n')}`;

    setCsvData(csvContent);
  };

  return (
    <>
      <button onClick={downloadCsv}>Download CSV</button>
      {csvData && (
        <a href={csvData} download="account_records_averages.csv">
          Download
        </a>
      )}
    </>
  );
}

export default AccountRecordsAveragesCsv;
