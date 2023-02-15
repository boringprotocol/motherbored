import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { useState } from 'react';
import { GetServerSideProps } from 'next'
import Peer, { PeerProps } from '../components/Peer'
import ConsumerPeer, { PeerProps as ConsumerPeerProps } from '../components/ConsumerPeer'
import prisma from '../lib/prisma'
import Head from 'next/head'
import PeerInsight from '../components/PeerInsight';
import { useTheme } from "next-themes"
import Link from 'next/link'
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import CopyToClipboardButton from '../components/CopyToClipboardButton';

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

const IndexPage: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [showConsumers, setShowConsumers] = useState(true);
  const [showProviders, setShowProviders] = useState(true);

  const { data: session } = useSession();
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
              {showConsumers ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Consumers
            </button>

            <button
              className={`mr-2 rounded-sm border border-gray-light ${theme === 'dark' ? 'dark:border-gray-dark' : ''} text-center inline-flex items-center text-xs px-4 py-3 text-boring-black ${theme === 'dark' ? 'dark:text-boring-white' : ''} hover:bg-gray-lightest ${theme === 'dark' ? 'dark:hover:bg-gray-dark' : ''}`}
              onClick={() => setShowProviders(!showProviders)}
            >
              {showProviders ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Providers
            </button>
            <Link href='/newpeer?mode=consumer&consumer_kind=pi'>
              <a className={`rounded-sm border border-gray-light ${theme === 'dark' ? 'dark:border-gray-dark' : ''} text-center inline-flex items-center text-xs px-4 py-3 text-boring-black ${theme === 'dark' ? 'dark:text-boring-white' : ''} hover:bg-gray-lightest ${theme === 'dark' ? 'dark:hover:bg-gray-dark' : ''}`}>
                ADD
              </a>
            </Link>
          </nav>


          {showConsumers && (
            <>
              <h2 className="text-lg text-boring-black dark:text-boring-white ml-2">Consumer Peers</h2>
              <p className='mb-4 text-xs ml-2'>Mobile clients coming soon.</p>
              <ul role="list" className=" pb-12 grid grid-cols-2 gap-6 md:grid-cols-8 2xl:grid-cols-6">
                {props.consumers.map((consumer) => (
                  <li key={consumer.name} className="shadow-md col-span-2 border rounded-sm cursor-pointer hover:border-gray dark:hover:border-gray border-gray-lightest dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
                    <ConsumerPeer peer={consumer} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {showProviders && (
            <>
              <h2 className="text-lg text-boring-black dark:text-boring-white ml-2">Provider Peers</h2>
              <p className='mb-4 text-xs ml-2'>Mobile clients coming soon.</p>
              <ul role="list" className=" pb-12 grid grid-cols-2 gap-6 md:grid-cols-4 2xl:grid-cols-6">
                {props.providers.map((providers) => (
                  <li key={providers.name} className="shadow-md col-span-2 border rounded-sm cursor-pointer hover:border-gray dark:hover:border-gray border-gray-lightest dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
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

export default IndexPage
