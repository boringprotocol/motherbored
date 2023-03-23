// components/NewRewardsAlert.tsx
import React, { useEffect, useState } from "react";
import { useClaimContext } from "../contexts/ClaimContext";

async function fetchTotalUnclaimedRewards(walletAddress: string, setData: Function, setError: Function) {
  try {
    const res = await fetch(`/api/claims/get-claims?wallet=${walletAddress}`);
    const data = await res.json();

    if (res.ok) {
      const unclaimed = data.filter((claim: any) => !claim.claimed);
      setData({
        totalUnclaimedRewards: unclaimed.reduce((acc: number, cur: any) => acc + cur.amount, 0),
        totalClaims: unclaimed.length,
      });
    } else {
      setError(data.error || "Failed to fetch data");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to fetch data");
  }
}

const NewRewardsAlert: React.FC<{ walletAddress: string }> = ({ walletAddress }) => {
  const [data, setData] = useState<{ totalUnclaimedRewards: number; totalClaims: number }>({ totalUnclaimedRewards: 0, totalClaims: 0 });
  const [error, setError] = useState<string | null>(null);
  const { claimUpdated, setClaimUpdated } = useClaimContext();

  useEffect(() => {
    fetchTotalUnclaimedRewards(walletAddress, setData, setError);
  }, [walletAddress, claimUpdated]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Return null if there are no unclaimed rewards
  if (data.totalUnclaimedRewards === 0) {
    return null;
  }

  return (
    <>
      <div className="alert shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p>Total unclaimed rewards: <span className={claimUpdated ? "bounce" : ""}>{data.totalUnclaimedRewards}</span></p>
          <span> | </span>
          <p>Total unclaimed claims: <span className={claimUpdated ? "bounce" : ""}>{data.totalClaims}</span></p>
          <a href="/wallet" className="ml-2 text-boring-blue underline">View Wallet</a>
        </div>
      </div>
    </>
  );
};

export default NewRewardsAlert;
