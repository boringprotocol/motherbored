import LayoutAuthenticated from '../../components/layoutAuthenticated';
import React from 'react';
import EpochDisplay from '../../components/epoch';
import EpochsUpdated from '../../components/EpochsUpdated';
import { useSession } from "next-auth/react";

export default function Epochs() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Return a loading indicator or skeleton UI
    return <div>Loading...</div>;
  }

  if (session?.user?.role === "l33t") {
    // Show l33t content
    return <LayoutAuthenticated>l33t
      {/* <div>
        <div className='p-12'>
          <p className='text-xs py-4'>See <a className='blue-100' href="#">Tokenomics</a> for the Platform Incentive Rewards allocation</p>
        </div>
        <div className='p-12'>
          <EpochsUpdated />
        </div>
        <EpochDisplay />
      </div> */}
    </LayoutAuthenticated>;
  } else {
    // Show n3wb content
    return (
      <div>fobidden zone</div>

    );
  }
}
