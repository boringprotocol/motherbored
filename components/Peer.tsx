import React from "react";
import Router from "next/router";
import { IoWifiOutline } from 'react-icons/io5';
import Image from 'next/image';


export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  target: string | null;
  pubkey: string | null;
  label: string | null;
  ssid: string | null;
};

const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {
  const peerAvatar = "https://source.boringavatars.com/sunset/" + peer.name + "?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
  
  return (
    

      <a className="border-boring-black hover:border-gray" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>
       
            <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">

              <div className="flex items-center space-x-3">
                <h3 className="font-jetbrains truncate text-lg text-boring-black dark:text-boring-white">{peer.name}</h3>
              </div>
              <p className="font-jetbrains mt-1 truncate text-xs text-gray-500">{peer.kind}</p>
              <p className="text-xs mt-6 pt-2 border-t border-gray-lightest dark:border-gray-dark"><IoWifiOutline className="float-left mr-3 text-xs"/>{peer.ssid} &middot; {peer.label}</p>
              {/* <div className="h-6 w-6">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
              </div> */}
            </div>
            <Image src={peerAvatar} alt="" width="48" height="48" />
          </div>

{/* 
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
            <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={peerAvatar} alt="" />
          </div>
          <div className="px-6  text-xs text-gray-dark">
            <span className="float-left mr-2"><IoIosKey /></span>
            <span className="float-left lowercase text-xs">{peer.setupkey} </span>
          </div>
          <div>
          </div>
        </div> */}


      </a>

    
  );
};

export default Peer;
