import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudOutline } from 'react-icons/io5'

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
    <div
      className='card card-bordered cursor-pointer shadow-md  hover:shadow-lg active:shadow-md'
      onClick={() => Router.push("/c/[id]", `/c/${peer.id}`)}
    >
      <div className="card-body">
        {isMotheboredConsumer && (
          <div className="inline-flex items-center text-xs mb-2">
            <IoWifiOutline className="mr-1" />
            {peer.ssid}
          </div>
        )}
        <h2 className='mb-2'>{peer.name}</h2>
        <p className="inline-flex items-center font-jetbrains text-xs capitalize mb-4">
          {isConsumer && <IoLaptopOutline className="mr-2" />}
          {isCloudProvider && <IoCloudOutline className="mr-2" />}
          {isLocalProvider && <IoServerOutline className="mr-2" />}
          <span className="capitalize">{peer.provider_kind} {peer.kind}</span>
        </p>
        <div className='py-4'>
          <span className="inline-block align-bottom text-xs">
            {peer.consumer_platform}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsumerPeer;
