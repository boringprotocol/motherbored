import axios from "axios";
import { useEffect, useState } from "react";
import EpochDisplay from "../../components/epoch";
import LayoutAuthenticated from "../../components/layoutAuthenticated";

export default function lfg() {

  // Handle the download button click
  const handleDownload = () => {
    // Build the CSV string
    let csv = 'Account,Period Shares,Percentage of Total,Tokens from Allocation\n';
    for (let i = 0; i < accountData.length; i++) {
      csv += `${accountData[i].account},${accountData[i].periodShares},${accountShares[i]},${periodAllocation * accountShares[i] / 100}%\n`;
    }

    // Create a blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    link.click();
  }

  // Declare a state variable to store the percentage of total period shares for each account
  const [accountShares, setAccountShares] = useState<number[]>([]);
  // Declare a state variable to store the account data
  const [accountData, setAccountData] = useState<{ account: string; periodShares: number }[]>([]);
  // Declare a state variable to store the total period shares
  const [totalPeriodShares, setTotalPeriodShares] = useState(0);
  // Declare a state variable to store the number of rows in the data
  const [rowAccounts, setAccountsTotal] = useState(0);
  // Declare a state variable to store the token allocation for each period
  const [periodAllocation, setPeriodAllocation] = useState(1800000);

  // Define the data string
  // pull from db latest settlements 
  const settlement_state = `account,period_shares,consumer_local,consumer_linux,consumer_windows,consumer_mac,provider_cloud,provider_local,v1_license,v2_license,vx_license,poa
  1523,35,1,2,2,2,3,2,3,1,3,2
  1524,25,1,2,2,2,3,2,3,1,3,2
  1525,25,1,2,2,2,3,2,3,1,3,2
  2a50,85,2,4,3,2,1,2,1,4,1,2`;

  // Calculate the total period shares and row count
  useEffect(() => {
    // Split the data string into an array of rows
    const rows = settlement_state.split('\n').slice(1); // Remove the header row

    // Initialize a variable to store the total
    let total = 0;

    // Loop through each row
    for (const row of rows) {
      // Split the row into an array of fields
      const fields = row.split(',');

      // If the row does not have at least two fields, or if the second field is not a valid integer, skip this row
      if (fields.length < 2 || isNaN(parseInt(fields[1], 10))) {
        continue;
      }

      // Parse the second field (period shares) as an integer
      const periodShares = parseInt(fields[1], 10);

      // Add the period shares to the total
      total += periodShares;
    }

    // Initialize an array to store the percentage of total period shares for each account
    const shares = [];

    // Initialize an array to store the account data
    const data = [];

    // Loop through each row again
    for (const row of rows) {
      // Split the row into an array of fields
      const fields = row.split(',');

      // If the row does not have at least two fields, or if the second field is not a valid integer, skip this row
      if (fields.length < 2 || isNaN(parseInt(fields[1], 10))) {
        continue;
      }

      // Parse the second field (period shares) as an integer
      const periodShares = parseInt(fields[1], 10);

      // Calculate the percentage of total period shares for this account
      const share = (periodShares / total) * 100;

      // Add the percentage to the shares array
      shares.push(share);

      // Store the account data
      data.push({ account: fields[0], periodShares });
    }

    // Update the totalPeriodShares, accountShares, accountData, and rowCount state variables
    setTotalPeriodShares(total);
    setAccountShares(shares);
    setAccountData(data);
    setAccountsTotal(rows.length);

  }, []); // The empty array

  // lfg


  return (
    <LayoutAuthenticated>

      <div className="p-12 text-xs"><span className="text-xs text-gray">boring-settlements:</span> function to calulate period shares from a user account's "points".</div>




      <div className="px-12 text-xs">

        {/* Display the total period shares and row count */}
        <p>Total Epoch Allocation: {periodAllocation}</p>
        <p>Number of accounts: {rowAccounts}</p>
        <p>Total period shares: {totalPeriodShares}</p>

        {/* Render the HTML table */}
        <table className="text-xs min-w-full divide-y divide-gray-dark mt-12">

          <thead>
            <tr className="text-gray">
              <th>Account</th>
              <th>Period Shares</th>
              <th>Percentage of Total</th>
              <th>Tokens from Allocation</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map(({ account, periodShares }, index) => (
              <tr key={account}>
                <td>{account}</td>
                <td>{periodShares}</td>
                <td>{accountShares[index].toFixed(2)}%</td>
                <td>{(periodAllocation / 100 * accountShares[index]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="py-12">
          <button className="border border-gray dark:border-gray-dark px-4 py-3" onClick={handleDownload}>Download as CSV</button>
        </div>
      </div>

      <div className="p-12">
        <EpochDisplay />
      </div>



    </LayoutAuthenticated>
  );
}
