import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline } from 'react-icons/io5'
import Image from 'next/image'

export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  target: string | null;
  pubkey: string | null;
  label: string | null;
  ssid: string | null;
  country_code: string | null;
  wifi_preference: string | null;
  wpa_passphrase: string | null;
};

const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {
const peerAvatar = "https://source.boringavatars.com/sunset/" + peer.name

  // 
  let providerActive = false
  if (peer.pubkey != null) {
    providerActive = true
  }

  let isProvider = false
  if (peer.kind == "provider") {
    isProvider = true
  }

  let isConsumer = false
  if (peer.kind == "consumer") {
    isConsumer = true
  }


  return (

<>
<a className="border-boring-black hover:border-gray" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>

<h2 className='text-lg md:text-xl lg:text-2xl px-4 mt-4'>{peer.name}</h2>

<p className="inline-flex items-center font-jetbrains px-4 text-sm text-gray-500 capitalize">
  {isProvider && (<IoServerOutline className="float-left mr-2" />)}
  {isConsumer && (<IoLaptopOutline className="float-left mr-2" />)} {peer.kind}
</p>

<div className='p-4 clear-right'><Image src={peerAvatar} alt="" width="48" height="48" /></div>

<p className="text-xs mt-6 p-4 border-t border-gray-lightest dark:border-gray-dark"><IoWifiOutline className="float-left mr-3 text-xs" />{peer.ssid} &middot; {peer.label}</p>

      {/* <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">

          <div className="flex items-center space-x-3">

            <h3 className="font-jetbrains truncate text-xl text-boring-black dark:text-boring-white">{peer.name}</h3>
              <div className="flex items-center space-x-3">
              
                <h3 className="font-jetbrains truncate text-xl text-boring-black dark:text-boring-white">lkjhlkjh{peer.name}</h3>
              </div>
              
              <p className="inline-flex items-center font-jetbrains mt-1 truncate text-sm text-gray-500 capitalize"><IoServerOutline className="float-left mr-2" />{peer.kind} Mode</p>
              {peer.name}
              <p className="text-xs mt-6 pt-2 border-t border-gray-lightest dark:border-gray-dark"><IoWifiOutline className="float-left mr-3 text-xs"/>{peer.ssid} &middot; {peer.label}</p>

            </div>
            <Image className="" src={peerAvatar} alt="" width="48" height="48" />
            
            <div>{ isProvider && providerActive && ("active")}</div>
            
          </div>
          <p className="font-jetbrains mt-1 truncate text-sm text-gray-500 capitalize"><IoServerOutline className="float-left mr-2" />{peer.kind} Mode</p>
          <p className="text-xs mt-6 pt-2 border-t border-gray-lightest dark:border-gray-dark"><IoWifiOutline className="float-left mr-3 text-xs" />{peer.ssid} &middot; {peer.label}</p>
        
        <Image className="" src={peerAvatar} alt="" width="48" height="48" />

        <div>{isProvider && providerActive && ("active")}</div>

      </div> */}

    </a>
</>

  );
};

export default Peer;
