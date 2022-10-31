import React from 'react'
import Router from 'next/router'
import { IoArrowForwardOutline } from 'react-icons/io5'
import Avatar from 'boring-avatars'

export type PeerPublicProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  provider_kind: string | null;
  target: string | null;
  pubkey: string | null;
  country_code: string | null;
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
  <>
        <td className="whitespace-nowrap py-0 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="h-11 w-10 mt-4 flex-shrink-0">
              <Avatar
                size={24}
                name={peerAvatar}
                variant="sunset"
              />
              {/* <img className="h-10 w-10 rounded-full" src="person.image" alt="" /> */}
            </div>
            <div className="ml-4">
              {/* <div className="font-medium text-gray-900">{peer.id}</div> */}
              <div className="text-gray-500">{peer.name}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {/* <div className="text-gray-900">.../</div> */}
          <div className="text-gray-500">NL</div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {/* <div className="text-gray-900">.../</div> */}
          <div className="text-gray-500">87</div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
          <span className="inline-flex rounded-full bg-green px-2 text-xs font-semibold leading-5 text-green-800">
            Active
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">14</td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <a className="text-indigo-600 hover:text-indigo-900">
          <IoArrowForwardOutline />
            <span className="sr-only">, person.name</span>
          </a>
        </td>
      </>
  );
};

export default PeerPublic;
