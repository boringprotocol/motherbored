import LayoutAuthenticated from "../components/layoutAuthenticated"
import React from 'react'
import csv from 'csvtojson';
import Link from 'next/link'

const dataPromise = csv().fromFile('./data/rewards_table.csv');

const RewardsTable = ({ data }) => {

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
      <p className="text-md mb-12">You have 2 providers, 1 consumers, 4 licenses, and 13 bad kitty cats. Your points/score/share is therefore 27 based on the rewards wable below.</p>
        <p className="text-xs mb-12">show point/share system rewards in a table. use the same data source in /data/rewards_table.csv when running <Link href="/settlements" legacyBehavior><a className="text-blue">/settlements.</a></Link></p>
      <table className="text-xs">
            <thead>
                <tr>
                    {/* <th>Account</th> */}
                    <th>Period Shares</th>
                    <th>Consumer Local</th>
                    <th>Consumer Linux</th>
                    <th>Consumer Windows</th>
                    <th>Consumer Mac</th>
                    <th>Provider Cloud</th>
                    <th>Provider Local</th>
                    <th>V1 License</th>
                    <th>V2 License</th>
                    <th>V3 License</th>
                    <th>POA</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.account}>
                        {/* <td>{row.account}</td> */}
                        <td>{row.period_shares}</td>
                        <td>{row.consumer_local}</td>
                        <td>{row.consumer_linux}</td>
                        <td>{row.consumer_windows}</td>
                        <td>{row.consumer_mac}</td>

                        <td>{row.provider_cloud}</td>
                        <td>{row.provider_local}</td>
                        <td>{row.v1_license}</td>
                        <td>{row.v2_license}</td>
                        <td>{row.v3_license}</td>
                        <td>{row.poa}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
    </LayoutAuthenticated>
  )
}


export const getServerSideProps = async () => {
    const data = await dataPromise;
    return { props: { data } }
}

export default RewardsTable;


