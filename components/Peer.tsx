import React from "react";
import Router from "next/router";
import { IoIosKey } from 'react-icons/io';


export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  target: string | null;
};

const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {
  return (
    <div>

      <a className="mt-3 w-1/3 items-center rounded-sm border hover:bg-gray-light border-gray-light float-left" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>

        <div key={peer.name} className="font-jetbrains rounded-lg-gray pb-10">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-lg text-gray-900">{peer.name}</h3>
              </div>
              <p className="mt-1  text-sm text-gray-500 capitalize">Mode: {peer.kind}</p>
              <p className="mt-1  text-sm text-gray-500">Group: All, Narnia</p>
              <p className="mt-1  text-sm text-gray-500">Provided by: {peer.target}</p>
              <p className="mt-1  text-sm text-gray-500">NFT License: MBV1-1000</p>
            </div>
            <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src="https://source.boringavatars.com/marble/80/{peer.name}" alt="" />
          </div>
          <div className="px-6  text-xs text-gray-dark">
            <span className="float-left mr-2"><IoIosKey /></span>
            <span className="float-left lowercase text-xs">{peer.setupkey} </span>
          </div>
          <div>
          </div>
        </div>


      </a>

    </div>
  );
};

export default Peer;
