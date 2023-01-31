import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { getServerSideProps } from './api/profile'
// import { updatePublicProfile } from './api/profile'
import Head from 'next/head'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { BsLightning } from 'react-icons/bs';


function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}



interface Props {
  user: UserProps,
  peers: PeerProps[]
}
interface UserProps {
  id: string;
  wallet: string;
  name: string;
  image: string;
  bio: string;
  publicProfile: boolean;
  peers: PeerProps[];
}
interface PeerProps {
  id: string;
  name: string;
  setupkey: string;
  target: string;
  kind: string;
  consumer_platform: string;
  provider_platform: string;
  userId: string;
  pubkey: string;
  label: string;
  provider_kind: string;
  wifi_preference: string;
  hw_mode: string;
  channel: number;
  ssid: string;
  country_code: string;
  wpa_passphrase: string;
}

const ProfilePage: React.FC<Props> = ({ user }) => {

  const [enabled, setEnabled] = useState(false)

  const [publicProfile, setPublicProfile] = useState(user.publicProfile);

  const handlePublicProfile = async () => {
    setPublicProfile(!publicProfile);
    await updatePublicProfile(user.id, !publicProfile);
  }

  const consumerPeers = user.peers.filter(peer => peer.kind === 'consumer')
  const consumerPeersCount = consumerPeers.length;
  const providerPeers = user.peers.filter(peer => peer.kind === 'provider')
  const providerPeersCount = providerPeers.length;

  const session = useSession();

  if (!session) {

    return (
      <Layout>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      </Layout>
    );
  }

  return (
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored - Boring Protocol</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      <div className="main px-12 text-xs">

      <div className='pt-12'>
      <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
          Public Profile
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          Show your profile to other users.
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-green text-gray-dark' : 'bg-gray dark:bg-gray text-gray dark:text-gray-dark',
          'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue focus:ring-offset-1'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-light shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      </Switch.Group>
      </div>


      <div className="mt-4 w-1/3 rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-indigo-600  focus-within:ring-indigo-600">
      <label htmlFor="name" className="block text-xs font-medium text-gray-900 mb-1">
       <BsLightning className='float-left mr-1' /> LN Address
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="block w-full border-0 p-0 text-gray-dark placeholder-gray bg-boring-white dark:bg-boring-black focus:ring-0 sm:text-sm"
        placeholder="fran@getalby.com"
      />
    </div>


        <div className="main pt-12 text-xs">
          <p>Name: {user.name}</p>
          <p>Wallet: {user.wallet}</p>
          <p>Image: {user.image}</p>

          <img src="https://twitter.com/FranTiberious/profile_image?size=original" alt="Profile Image" />
          <p>Bio: {user.bio}</p>
          <h2 className='text-sm mt-6'>Consumer Peers:</h2>
          <p className="mb-2">You have {consumerPeersCount}/10 Consumer Peers</p>
          <ul className=''>
            {consumerPeers && consumerPeers.length > 0 ? consumerPeers.map((peer, index) => (
              <li key={index}><a href={`/consumer/${encodeURIComponent(peer.name)}`}>{peer.name}</a>, {peer.consumer_platform}</li>
            )) : <p>No Consumer Peers Available</p>}
          </ul>
          <h2 className='text-sm mt-6'>Provider Peers:</h2>
          <p className="mb-2">You have {providerPeersCount}/10 Provider Peers</p>
          <ul>
            {providerPeers && providerPeers.length > 0 ? providerPeers.map((peer, index) => (
              <li key={index}><a href={`/provider/${encodeURIComponent(peer.name)}`}>{peer.name}</a>
                , {peer.country_code}, {peer.provider_platform}</li>
            )) : <p>No Provider Peers Available</p>}
          </ul>
        </div>
      </div>
    </LayoutAuthenticated>
  );
}

export default ProfilePage
export { getServerSideProps }

