import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudCircleOutline, IoCloudOutline } from 'react-icons/io5'
import Image from 'next/image'
import Avatar from 'boring-avatars'

export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  provider_kind: string | null;
  target: string | null;
  pubkey: string | null;
  label: string | null;
  ssid: string | null;
  country_code: string | null;
  wifi_preference: string | null;
  wpa_passphrase: string | null;
  channel: string | null;
};


// generating peer avatar from the id as opposed to the label
const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {
  const peerAvatar = peer.id

  // 
  let providerActive = false
  if (peer.pubkey != null) {
    providerActive = true
  }


  // Sorting by peer kind (provider or consumer)
  let isProvider = false
  if (peer.kind == "provider") {
    isProvider = true
  }

  let isConsumer = false
  if (peer.kind == "consumer") {
    isConsumer = true
  }


  // Sorting by provider_kind (local or cloud)
  let isCloudProvider = false
  if (peer.provider_kind == "cloud") {
    isCloudProvider = true
  }

  let isLocalProvider = false
  if (peer.provider_kind == "local") {
    isLocalProvider = true
  }


  
  

  return (

    <>
      <a className="border-boring-black hover:border-gray" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>

        <h2 className='text-lg md:text-xl lg:text-2xl px-4 mt-4'>{peer.name}</h2>

        <p className="inline-flex items-center font-jetbrains px-4 text-sm text-gray-500 capitalize">
          {/* {isProvider && (<IoServerOutline className="float-left mr-2" />)} */}
          {isConsumer && (<IoLaptopOutline className="float-left mr-2" />)} 
          {isCloudProvider && (<IoCloudOutline className="float-left mr-2" />)}
          {isLocalProvider && (<IoServerOutline className="float-left mr-2" />)}<span className="capitalize">{peer.provider_kind} {peer.kind}</span>
          
        </p>
        
        <div className="pt-4 pl-4">
        <Avatar
          size={40}
          name={peerAvatar}
          variant="sunset"
        />
        </div>

        <p className="text-xs mt-6 p-4 border-t border-gray-lightest dark:border-gray-dark">
        
        {isConsumer && (<IoWifiOutline className="float-left mr-2" />)} 
        {isProvider && isLocalProvider && (<IoWifiOutline className="float-left mr-2" />)} 
        
        {isConsumer && (
          <>
          {peer.ssid} &middot; &nbsp;
          </>
        )}

        {isLocalProvider && (
          <>
          {peer.ssid} &middot; &nbsp;
          </>
        )}
        

        {peer.label}
 
 </p>

      </a>
    </>

  );
};

export default Peer;
