import LayoutAuthenticated from '../../components/layoutAuthenticated';
import React from 'react';
import EpochDisplay from '../../components/epoch';
import EpochsUpdated from '../../components/EpochsUpdated';


export default function Epoch() {
  return (

    <LayoutAuthenticated>
      <div>
        <div className='p-12'>
          $BOP: 126,500,000 | 10 Years | Distributed to date:[] | Remaining:[]<br />
          <p>Era 1: 1st 5 Years | Era 2: 2nd 5 Years</p>
          <p>Events: 1, 2, 3, 4, 5</p>
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
