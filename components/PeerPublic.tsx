import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudCircleOutline, IoCloudOutline, IoPricetagOutline } from 'react-icons/io5'
import Image from 'next/image'
import Avatar from 'boring-avatars'

export type PeerPublicProps = {
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
const PeerPublic: React.FC<{ peer: PeerPublicProps }> = ({ peer }) => {
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

    <div className=''>
    
      <a className="" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>


      
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
      

        <span className='text-sm'>{peer.name}</span>


          {/* {isProvider && (<IoServerOutline className="float-left mr-2" />)} */}
          {isConsumer && (<IoLaptopOutline className="float-left mr-2" />)}
          {isCloudProvider && (<IoCloudOutline className="float-left mr-2" />)}
          {isLocalProvider && (<IoServerOutline className="float-left mr-2" />)}<span className="capitalize">{peer.provider_kind} {peer.kind}</span>



      
          <Avatar
            size={15}
            name={peerAvatar}
            variant="sunset"
          />
      

        
        
      </a>
      
    </div>

  );
};

export default PeerPublic;
