import { useState, useEffect } from 'react';

interface RewardsPoints {
  consumer_local: number;
  consumer_linux: number;
  consumer_windows: number;
  consumer_mac: number;
  provider_cloud: number;
  provider_local: number;
  v1_license: number;
  v2_license: number;
  v3_license: number;
  poa: number;
}

export default function RewardsPoints() {
  const [rewardsPoints, setRewardsPoints] = useState<RewardsPoints[] | null>(null);

  useEffect(() => {
    fetch('/data/rewards-points.json')
      .then(response => response.json())
      .then(data => setRewardsPoints(data))
      .catch(error => console.error(error));
  }, []);

  if (rewardsPoints === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Rewards Points</h2>
      <table>
        <thead>
          <tr>
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
          {rewardsPoints.map((points, index) => (
            <tr key={index}>
              <td>{points.consumer_local}</td>
              <td>{points.consumer_linux}</td>
              <td>{points.consumer_windows}</td>
              <td>{points.consumer_mac}</td>
              <td>{points.provider_cloud}</td>
              <td>{points.provider_local}</td>
              <td>{points.v1_license}</td>
              <td>{points.v2_license}</td>
              <td>{points.v3_license}</td>
              <td>{points.poa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
