import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudOutline, IoPricetagOutline } from 'react-icons/io5'
import Avatar from 'boring-avatars'
import Identicon from 'react-identicons'

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

    <div className='p-4'>
    
      <a className="border-boring-black hover:border-gray" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>

      <div className="px-4 pt-4">&nbsp;

      {isProvider && (
          <>
          <span className="float-right animate-pulse inline-flex rounded-full h-2 w-2 bg-green"></span>  
          {/* {peer.target}     */}
          </>
        )}


        {isConsumer && (<IoWifiOutline className="float-left mr-2" />)}
        {isProvider && isLocalProvider && (<IoWifiOutline className="float-left mr-2" />)}

        {isConsumer && (
          <>
            {peer.ssid}
          </>
        )}

        {isLocalProvider && (
          <>
            {peer.ssid}
          </>
        )}
      </div>

        <h2 className='text-lg md:text-xl lg:text-2xl px-4 mt-4'>{peer.name}</h2>

        <p className="inline-flex items-center font-jetbrains px-4 text-xs text-gray-500 capitalize">
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
            colors={[
              "#FB6900",
              "#F63700",
              "#004853",
              "#007E80",
              "#00B9BD"]} 
          />
          {/* <Identicon string={peerAvatar} size={40} fg="#666" /> */}
        </div>
        
      </a>
      <div className='pt-4'>
      <span className="inline-block align-bottom text-xs mt-6 p-4">
        <IoPricetagOutline className="float-left mr-2"/> {peer.label}
      </span>
      </div>
    </div>

  );
};

export default Peer;
