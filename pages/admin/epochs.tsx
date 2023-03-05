import LayoutAuthenticated from '../../components/layoutAuthenticated';
import React from 'react';
import EpochDisplay from '../../components/epoch';
import EpochsUpdated from '../../components/EpochsUpdated';

export default function Epoch() {
  return (

    <LayoutAuthenticated>
      <div>
        <div className='p-12'>
          <p className='text-xs py-4'>See <a className='blue-100' href="#">Tokenomics</a> for the Platform Incentive Rewards allocation</p>
        </div>
        <div className='p-12'>
          <EpochsUpdated />
        </div>
        <EpochDisplay />
      </div>
    </LayoutAuthenticated>
  );
}
