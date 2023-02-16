import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { useState } from 'react';
import { GetServerSideProps } from 'next'
import Peer, { PeerProps } from '../components/Peer'
import ConsumerPeer, { PeerProps as ConsumerPeerProps } from '../components/ConsumerPeer'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { useTheme } from "next-themes"
import Link from 'next/link'
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import Greetings from '../components/Greetings';
import StackedBarChart from '../components/StackedBarChart';

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { peers: [] } }
  }

  const user = await prisma.user.findFirst({
    where: { wallet: session.user.name }
  })

  const [peers, providers, consumers] = await Promise.all([
    prisma.peer.findMany({ where: { userId: user?.id } }),
    prisma.peer.findMany({ where: { userId: user?.id, kind: 'provider' } }),
    prisma.peer.findMany({ where: { userId: user?.id, kind: 'consumer' } }),
  ])

  return {
    props: { peers, consumers, providers },
  }
}


type Props = {
  peers: PeerProps[],
  consumers: ConsumerPeerProps[],
  providers: PeerProps[],
}



const Dashboard: React.FC<Props> = (props) => {

  const { data: session } = useSession();
  const { theme } = useTheme();
  const [showConsumers, setShowConsumers] = useState(true);
  const [showProviders, setShowProviders] = useState(true);

  const data = [
    [10, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76,],
    [15, 25, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 20, 30, 10, 20, 35, 20, 30, 56, 67, 76, 10, 20, 30, 10, 20, 30, 56, 67, 76, 20, 30, 10, 20,],
    [20, 30, 40],
    [25, 35, 45],
    [30, 40, 50],
    [35, 45, 55],
    [40, 50, 60]
  ];
  console.log("data", data)


  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7'];
  console.log("labels", labels)


  if (!session) {
    return (

      // NOT AUTHENTICATED
      <Layout>
        <Head>
          <title>Boring Protocol</title>
          <meta property="og:title" content="Boring Protocol" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" href="/img/favicon.ico" />
        </Head>
      </Layout>
    );
  }

  return (

    // AUTHENTICATED - Home Page Main Panel 🐈
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored - Boring Protocol</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>

      {/* Main content */}
      <div className="main pt-12 text-xs">

        {/* <PeerInsight peersLength={props.peers.length} /> */}

        {/* PEERS */}

        {/* <CopyToClipboardButton text='hello' /> */}

        <div className="px-4 sm:px-8 md:px-12 pb-16">

          <nav className='mb-4'>
            <button
              className={`mr-2 rounded-sm border border-gray-light ${theme === 'dark' ? 'dark:border-gray-dark' : ''} text-center inline-flex items-center text-xs px-4 py-3 text-boring-black ${theme === 'dark' ? 'dark:text-boring-white' : ''} hover:bg-gray-lightest ${theme === 'dark' ? 'dark:hover:bg-gray-dark' : ''}`}
              onClick={() => setShowConsumers(!showConsumers)}
            >
              {showConsumers ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Clients
            </button>

            <button
              className={`mr-2 rounded-sm border border-gray-light ${theme === 'dark' ? 'dark:border-gray-dark' : ''} text-center inline-flex items-center text-xs px-4 py-3 text-boring-black ${theme === 'dark' ? 'dark:text-boring-white' : ''} hover:bg-gray-lightest ${theme === 'dark' ? 'dark:hover:bg-gray-dark' : ''}`}
              onClick={() => setShowProviders(!showProviders)}
            >
              {showProviders ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Nodes
            </button>
            <Link href='/newpeer?mode=consumer&consumer_kind=pi'>
              <a className={`rounded-sm border border-gray-light ${theme === 'dark' ? 'dark:border-gray-dark' : ''} text-center inline-flex items-center text-xs px-4 py-3 text-boring-black ${theme === 'dark' ? 'dark:text-boring-white' : ''} hover:bg-gray-lightest ${theme === 'dark' ? 'dark:hover:bg-gray-dark' : ''}`}>
                ADD
              </a>
            </Link>
          </nav>

          <div className="border border-gray-lighter dark:border-gray-darker p-6 mb-12">

            {/* <StackedBarChart data={data} labels={labels} /> */}

            <p className="text-sm mb-2"><Greetings />. You have 2 Nodes and 3 VPN clients configured.</p>

            <p className="text-xs mb-2">Your average points score for the current Epoch is 74 (0.034% share) <Link href={''}><a className='text-boring-blue underline'>Points Chart</a></Link> | <Link href={''}><a className='text-boring-blue underline'>Points Calculator</a></Link></p>

            <p>Your total points share was 0.017% at the last Epoch earning 926.3465 $BOP. <Link href={''}><a className='text-boring-blue underline'>Share Calulatator</a></Link> | <Link href={''}><a className='text-boring-blue underline'>Distribution History</a></Link></p>

            <button className="bg-boring-black text-boring-white rounded-sm px-4 py-2 mt-4">Claim Rewards</button>

          </div>


          {showConsumers && (
            <>
              <h2 className="mb-2 text-sm text-gray-light dark:text-gray ml-2">Boring VPN Clients</h2>

              <ul role="list" className=" pb-12 grid grid-cols-2 gap-6 md:grid-cols-8 2xl:grid-cols-6">
                {props.consumers.map((consumer) => (
                  <li key={consumer.name} className="shadow-md col-span-2 border rounded-sm cursor-pointer hover:border-gray-lighter dark:hover:border-gray-dark border-gray-lightest dark:border-gray-darker text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
                    <ConsumerPeer peer={consumer} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {showProviders && (
            <>
              <h2 className="mb-2 text-sm text-gray-light dark:text-gray ml-2">Network Nodes</h2>
              {/*  */}
              <ul role="list" className=" pb-12 grid grid-cols-2 gap-6 md:grid-cols-4 2xl:grid-cols-6">
                {props.providers.map((providers) => (
                  <li key={providers.name} className="shadow-md col-span-2 border rounded-sm cursor-pointer hover:border-gray-lighter dark:hover:border-gray-dark border-gray-lightest dark:border-gray-darker text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
                    <Peer peer={providers} />
                  </li>
                ))}
              </ul>
            </>
          )}

        </div>
      </div>
    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default Dashboard
