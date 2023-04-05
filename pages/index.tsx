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
import PeerInsight from '../components/PeerInsight';
import GetClaims from '../components/GetClaims';
import ProviderSelector from '../components/ProviderSelector';
import NewRewardsAlert from '../components/NewRewardsAlert';
import Waiting from '../components/art/waiting';
import AccountStats from '../components/AccountStats';
import CopyToClipboardButton from 'components/CopyToClipboardButton';
import WomanCanPhone from 'components/art/woman-can-phone';
import { PlusIcon } from '@heroicons/react/24/outline';


const getServerSideProps: GetServerSideProps = async ({ req, res }) => {


  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { peers: [] } }
  }

  const user = await prisma.user.findFirst({
    where: { wallet: session.user.name }
  })

  if (user == null) {
    if (session.user.name) {
      const sessionUser = session.user.name
      const user = await prisma.user.create({
        data: {
          wallet: sessionUser,
        },
      })
    }
  }

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
  user: any;
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
  // console.log("data", data)


  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 7', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 7', 'Day 7'];
  // console.log("labels", labels)


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
      <div className="main pt-4 text-xs relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 -z-50 opacity-90">
          <WomanCanPhone />
          {/* <Waiting /> */}
        </div>

        {/* <div className='p-12'>
          <ProviderSelector />
        </div> */}

        {/* <PeerInsight peersLength={props.peers.length} /> */}

        {/* PEERS */}

        {/* <CopyToClipboardButton text='hello' /> */}

        <div className="px-4 sm:px-8 md:px-12 pb-16">


          <div className='my-8'>
            <NewRewardsAlert walletAddress={''} />
          </div>

          <nav className='mb-4'>


            <button
              className={`btn btn-outline btn-sm mr-2 inline-flex items-center text-xs `}
              onClick={() => setShowProviders(!showProviders)}
            >
              {showProviders ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Nodes
            </button>

            <button
              className={`btn btn-outline btn-sm mr-2 inline-flex items-center text-xs`}
              onClick={() => setShowConsumers(!showConsumers)}
            >
              {showConsumers ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Clients
            </button>

            {/* <button
              className={`btn btn-outline btn-sm mr-2 ${theme === 'dark' ? 'dark:text-boring-white' : 'text-boring-black'} inline-flex items-center text-xs `}
              onClick={() => setShowClaims(!showClaims)}
            >
              {showClaims ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Claims
            </button> */}


          </nav>




          {/* <AccountStats /> */}





          {/* <StackedBarChart data={data} labels={labels} /> */}

          {/* {showClaims && (
            <>
              <GetClaims />
            </>
          )} */}

          {/* 
          
          with session user get wallet row form rewards-
          
          */}
          {/* <div className="border border-gray-lighter dark:border-gray-darker p-6 mb-12">
            last snapshot date:

            component that selects from AccountHistory last snapshot date
          </div>
          <div className="border border-gray-lighter dark:border-gray-darker p-6 mb-12">
            account-rewards-averages

            component that selects from AccountHistory authorized users account averages
          </div>
          <div className="border border-gray-lighter dark:border-gray-darker p-6 mb-12">
            account-rewards-averages

            component that selects from AccountHistory authorized users account averages
          </div> */}

          {/* <div className="border border-gray-lighter dark:border-gray-darker p-6 mb-12">


            <p className="text-sm mb-2"><Greetings />. You have 2 Nodes and 3 VPN clients configured.</p>

            <p className="text-xs mb-2">Your average points score for the current Epoch is 74 (0.034% share) <Link href={''}><a className='text-boring-blue underline'>Points Chart</a></Link> | <Link href={''}><a className='text-boring-blue underline'>Points Calculator</a></Link></p>

            <p>Your total points share was 0.017% at the last Epoch earning 926.3465 $BOP. <Link href={''}><a className='text-boring-blue underline'>Share Calulatator</a></Link> | <Link href={''}><a className='text-boring-blue underline'>Distribution History</a></Link></p>

            <button className="bg-boring-black text-boring-white rounded-sm px-4 py-2 mt-4">Claim Rewards</button>

          </div> */}




          {showProviders && (
            <>
              <h2 className="mb-2 text-sm">Network Nodes</h2>
              {/*  */}
              <ul role="list" className=" pb-12 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2">
                {props.providers.map((providers) => (
                  <li key={providers.name} className="">
                    <Peer peer={providers} />
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="relative block w-full rounded-md border border-dotted border-base-300 p-12 text-center "
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-base-content"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new Node</span>
                  </button>
                </li>
              </ul>
            </>
          )}


          {showConsumers && (
            <>
              <h2 className="mb-2 text-sm">Boring VPN Clients</h2>

              <ul role="list" className="pb-12 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
                {props.consumers.map((consumer) => (
                  <li key={consumer.name}>
                    <ConsumerPeer peer={consumer} />
                  </li>
                ))}

                {/* {props.consumers.map((consumer) => (
                  <li key={consumer.name} className="shadow-md col-span-1 md:col-span-2 border rounded-sm cursor-pointer hover:border-gray-lighter dark:hover:border-gray-dark border-gray-lightest dark:border-gray-darker text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
                    <ConsumerPeer peer={consumer} />
                  </li>
                ))} */}
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
