import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudOutline, IoPricetagOutline } from 'react-icons/io5'

export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  provider_kind: string | null;
  provider_platform: string | null;
  consumer_platform: string | null;
  target: string | null;
  pubkey: string | null;
  label: string | null;
  ssid: string | null;
  country_code: string | null;
  wifi_preference: string | null;
  wpa_passphrase: string | null;
  channel: string | null;
};

const ConsumerPeer: React.FC<{ peer: PeerProps }> = ({ peer }) => {

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

  let isMotheboredConsumer = false
  if (peer.consumer_platform == "motherbored") {
    isMotheboredConsumer = true
  }

  return (





    <div className='p-6'>

      {/* {isMotheboredConsumer && (<>outline</>)} */}

      <a className="border-boring-black hover:border-gray" onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>
        {/* if it's a motherbored show the wifi info */}
        {isMotheboredConsumer && (<>
          <div className="inline-flex items-center text-xs text-gray-light">
            <IoWifiOutline className="mr-1" />{peer.ssid}
          </div>
        </>)}

        <h2 className=''>{peer.name}</h2>
        {/* <p className="inline-flex items-center font-jetbrains text-xs text-gray-500 capitalize">
          {isConsumer && (<IoLaptopOutline className="float-left mr-2" />)}
          {isCloudProvider && (<IoCloudOutline className="float-left mr-2" />)}
          {isLocalProvider && (<IoServerOutline className="float-left mr-2" />)}
          <span className="capitalize">{peer.provider_kind} {peer.kind}</span>
        </p> */}
      </a>
      <div className='py-4'>
        <span className="inline-block align-bottom text-xs">
          {peer.consumer_platform}
          {/* <IoPricetagOutline className="float-left mr-2" /> {peer.label} */}
        </span>
      </div>
    </div>

  );
};

export default ConsumerPeer;
