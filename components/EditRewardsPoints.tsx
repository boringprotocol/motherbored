import { useState, useEffect } from 'react';

interface RewardsPoints {
  consumer_local?: number;
  consumer_linux?: number;
  consumer_windows?: number;
  consumer_mac?: number;
  provider_cloud?: number;
  provider_local?: number;
  v1_license?: number;
  v2_license?: number;
  vx_license?: number;
  poa?: number;
}

export default function EditRewardsPoints() {
  const [rewardsPoints, setRewardsPoints] = useState<RewardsPoints>({
    consumer_local: 0,
    consumer_linux: 0,
    consumer_windows: 0,
    consumer_mac: 0,
    provider_cloud: 0,
    provider_local: 0,
    v1_license: 0,
    v2_license: 0,
    vx_license: 0,
    poa: 0
  });

  useEffect(() => {
    fetch('/data/rewards-points.json')
      .then((res) => res.json())
      .then((data) => setRewardsPoints(data[0]));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRewardsPoints((prevState) => ({
      ...prevState,
      [name]: Number(value) // convert value to number
    }));
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('rewardsPoints:', rewardsPoints); // add this line
    fetch('/api/rewards-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rewardsPoints)
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="consumer_local">Consumer Local:</label>
        <input
          type="number"
          id="consumer_local"
          name="consumer_local"
          value={rewardsPoints.consumer_local || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="consumer_linux">Consumer Linux:</label>
        <input
          type="number"
          id="consumer_linux"
          name="consumer_linux"
          value={rewardsPoints.consumer_linux || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="consumer_windows">Consumer Windows:</label>
        <input
          type="number"
          id="consumer_windows"
          name="consumer_windows"
          value={rewardsPoints.consumer_windows || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="consumer_mac">Consumer Mac:</label>
        <input
          type="number"
          id="consumer_mac"
          name="consumer_mac"
          value={rewardsPoints.consumer_mac || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="provider_cloud">Provider Cloud:</label>
        <input
          type="number"
          id="provider_cloud"
          name="provider_cloud"
          value={rewardsPoints.provider_cloud || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="provider_local">Provider Local:</label>
        <input
          type="number"
          id="provider_local"
          name="provider_local"
          value={rewardsPoints.provider_local || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="v1_license">V1 License:</label>
        <input
          type="number"
          id="v1_license"
          name="v1_license"
          value={rewardsPoints.v1_license || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="v2_license">V2 License:</label>
        <input
          type="number"
          id="v2_license"
          name="v2_license"
          value={rewardsPoints.v2_license || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="vx_license">VX License:</label>
        <input
          type="number"
          id="vx_license"
          name="vx_license"
          value={rewardsPoints.vx_license || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="poa">Proof of Ability:</label>
        <input
          type="number"
          id="poa"
          name="poa"
          value={rewardsPoints.poa || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
