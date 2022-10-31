import React, { useState } from "react"
import { GetServerSideProps } from "next"
import Peer, { PeerProps } from "../../../components/Peer"
import LayoutAuthenticated from "../../../components/layoutAuthenticated"
import prisma from "../../../lib/prisma"
import { useSession, getSession } from "next-auth/react"
import { IoArrowBack } from "react-icons/io5"
import Avatar from "boring-avatars"
import Link from "next/link"
import { GetStatsForPubkey } from "../../../lib/influx"
import Chart from "chart.js"

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {

    const session = await getSession({ req });
    if (!session || !session.user || !session.user.name) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    const user = await prisma.user.findFirst({
        where: { wallet: session.user.name }
    })

    if (user == null || user.id == null) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    if (params == null || params.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    if (params.id == null) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    const paramsId = String(params.id)

    const peer = await prisma.peer.findFirst({
        where: {
            id: { equals: paramsId, },
            userId: { equals: user.id, },
        }
    });

    if (peer == null || peer.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    const targetPeer = await prisma.peer.findUnique({
        where: {
            id: String(peer.target),
        },
        select: {
            name: true,
            id: true,
            country_code: true,
            label: true,
        },
    });

    const providerPeers = await prisma.peer.findMany({
        where: { kind: "provider", pubkey: { not: null } },
        select: {
            name: true,
            id: true,
            country_code: true,
            label: true,
        },
    })

    // we're a provider, return stats and no target
    if (peer.kind == "provider" && peer.pubkey != null) {
        const statsData = await GetStatsForPubkey(peer.pubkey)
        //console.log(statsData)
        return { props: { peer: peer, stats: statsData, providerPeers: providerPeers } }
    }

    // somehow we are a consumer with no target, return early w/no target
    if (targetPeer == null || targetPeer.name == null) {
        return { props: { peer: peer, providerPeers: providerPeers } }
    }

    // catchall return, consumers get here
    return {
        props: { peer: peer, target: targetPeer, providerPeers: providerPeers },
    };
};

type Props = {
    peer: PeerProps,
    target: PeerProps,
    providerPeers: PeerProps[],
}

const ShowDirectoryPeer: React.FC<Props> = (props) => {

    // generating peer avatar from the id as opposed to the label
    const peerAvatar = props.peer.id

    // dude - update components/PeerPublic.tsx to make more of these
    const [name, setName] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const [country_code, setSelectedCountryCode] = useState(props.peer.country_code)
    const [wifi_preference, setSelectedWifiPreference] = useState(props.peer.wifi_preference)
    const [wpa_passphrase, setSelectedWPAPassphrase] = useState(props.peer.wpa_passphrase)
    const [target, setTarget] = useState(props.target);
    if (target == null) {
        setTarget(props.providerPeers[0])
    }
    const id = props.peer.id;
    
    const stats = [
        { name: 'Total Consumers', stat: '7' },
        { name: 'Avg. Open Rate', stat: '58.16%' },
        { name: 'Avg. Click Rate', stat: '24.57%' },
      ]

    return (
        <LayoutAuthenticated>

            {/* rows and columns w/ grid */}
            <div className="p-8 xl:p-12 xl:pt-12"><Link href={"/directory"}><a className="inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-2 py-1 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2" href="/directory"><IoArrowBack className="mr-2" /> directory </a></Link></div>

      
           
            <div className="p-8  xl:pt-0 grid overflow-hidden grid-cols-4 md:grid-cols-6 grid-rows-1 sm:gap-2">

                <div className="box row-start-1 col-span-4 md:col-span-6 col-start-2 md:col-start-1">

                    <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl pl-6 pt-12 mb-12">wagmi-snowglobe-4727</h1>

                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden bg-white px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>

                </div>

                <div className="box row-start-1 md:row-start-2 col-start-1 col-span-1 md:col-span-2">
                    <Avatar size="100%" name="wagmi-snowglobe-4727" variant="sunset" />
                </div>

                <div className=" box col-start-1 col-span-4 sm:col-span-4 ">
                    
                        <div className="m-12 border border-gray-lightest dark:border-gray-dark">
                            <ul>
                                <li>Download speed</li>
                                <li>Upload speed</li>
                                <li>Latency</li>
                            </ul>
                        </div>
                    
                </div>

                <div className="box row-start-4 md:row-start-3 col-start-1 col-span-2 md:col-span-2 ">
                    {/* The small print. Details on the node */}
                    <div className="col-span-1  mt-12 text-gray">
                        <p className="text-xs leading-relaxed">
                        Download speed
Acceptable
600 Mbps
Acceptable: 100+ Mbps
Degraded: 50-99 Mbps
Poor: 30-49 Mbps
Failed: 0-29 Mbps
                        </p>
                    </div>
                </div>

            </div>

        </LayoutAuthenticated>
    );
};

export default ShowDirectoryPeer;
