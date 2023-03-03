import { useSession } from 'next-auth/react'
import Layout from '../../../components/layout'
import LayoutAuthenticated from '../../../components/layoutAuthenticated'
import React from 'react'
import { getServerSideProps } from '../../api/profile'
import Head from 'next/head'
import { useState } from 'react'
import EditProfile from '../../../components/editProfile'
import ProviderSelector from '../../../components/ProviderSelector'
import Link from 'next/link'


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


    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);
    const [image, setImage] = useState(user.image);


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

            <div className="main px-4 sm:px-12 text-xs">

                <Link href={`/a/${user.id}`}>
                    <a className="btn btn-primary">View Profile</a>
                </Link>


                {/* <Breakpoints /> */}

                {/* <div className="grid grid-cols-7">
                    <div className="bg-boring-yellow p-1 text-black"></div>
                    <div className="bg-boring-orange p-1 text-black"></div>
                    <div className="bg-boring-red p-1 text-black"></div>
                    <div className="bg-boring-blue p-1 text-black"></div>
                    <div className="bg-boring-green p-1 text-black"></div>
                    <div className="bg-boring-white p-1 text-black"></div>
                    <div className="bg-black text-boring-white p-1"></div>
                </div> */}


                <EditProfile />


                <div className="main pt-12 text-xs">

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

