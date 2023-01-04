import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Peer, { PeerProps } from '../components/Peer'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { IoLogoAndroid, IoLogoApple, IoLogoWindows, IoPhonePortrait } from 'react-icons/io5'


// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(' ')
// }

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

const peers = await prisma.peer.findMany({
    where: { userId: user?.id },
  })
  return {
    props: { peers },
  }
}


type Props = {
  peers: PeerProps[],
  providers: PeerProps[],
}

const PeerPage: React.FC<Props> = (props) => {  

  const { data } = useSession(); 
  const { data: session, status } = useSession();
  if (!session) {

    return (

      // NOT AUTHENTICATED - Home Page Main Panel 🐈
      <Layout>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
        <link rel="apple-touch-icon" href="/img/favicon.png"/>
        {/* make open graph / twitter cards here */}
      </Head>
    
      {/* Main content */}
      <div className="main pt-12 text-xs">
      <p className="px-12">VPN: You are using 3 out of your allowed 4 consumer peers on the elon plan (8 dollars</p>
      <p className="px-12">Mining: </p>
        <p className="p-12">You are using 3 out of your allowed 4 consumer peers on the elon plan (8 dollars</p>

        <div className="px-4 sm:px-8 md:px-12 pb-16">
        <div role="list" className="grid-rows-6 pb-12 grid grid-cols-2 gap-6 sm:grid-cols-4 2xl:grid-cols-6">
          {/* add motherbored consumer */}
          <div className="shadow-md rounded-lg pb-2 pt-4 col-span-2 row-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
              <button
              type="button"
              onClick={() => Router.push("/newpeer?mode=consumer&consumer_kind=local_consumer")}
              className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                />
              </svg>
              <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Motherbored Consumer</span>
              <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your Motherbored to run as a consumer peer.</span>
              </button>
          </div> {/* /#add-peer */}
          <div className="grid grid-cols-2 gap-6 col-span-2 row-span-2">
            <div className="pb-2 pt-4 col-span-2 row-span-1">
              <h2>VPN</h2>  
              <IoLogoWindows />
              
            </div>
            <div className="shadow-md rounded-lg pb-2 pt-4 col-span-1 row-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                    <button
                    type="button"
                    onClick={() => Router.push("/newpeer?mode=consumer")}
                    className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                    <IoPhonePortrait /><IoLogoApple />
                    <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add iPhone Consumer</span>
                    <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your iPhone to run as a consumer peer.</span>
                    </button>
            </div> {/* /#add-peer */}
            <div className="shadow-md rounded-lg pb-2 pt-4 col-span-1 row-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                    <button
                    type="button"
                    onClick={() => Router.push("/newpeer?mode=consumer")}
                    className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <IoLogoAndroid />
                    <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Android Consumer</span>
                    <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your Android phone to run as a consumer peer.</span>
                    </button>
            </div> {/* /#add-peer */}
          </div>
  

          <div className="shadow-md rounded-lg pb-2 pt-4 col-span-2 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
          <button
                type="button"
                onClick={() => Router.push("/newpeer?mode=provider&provider_kind=local")}
                className="relative block w-full rounded-lg text-boring-black dark:text-boring-white p-12 text-center hover:border-gray dark:hover:border-gray focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Motherbored Provider</span>
                <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your Motherbored to run as provider peer.</span>
                </button>
          </div> 
          <div className="shadow-md rounded-lg pb-2 pt-4 col-span-2 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
          <button
                title="LFG"
                type="button"
                onClick={() => Router.push("/newpeer?mode=provider&provider_kind=cloud")}
                className="relative block w-full rounded-lg text-boring-black dark:text-boring-white p-12 text-center hover:border-gray dark:hover:border-gray focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <span className="font-jetbrains mt-2 block text-sm text-gray-dark dark:text-boring-white">Add Cloud Provider</span>
                <span className="font-jetbrains mt-2 block text-xs text-gray">Deploy to a virtual machine offered by any cloud provider (e.g., AWS, DigitalOcean, Hetzner, Google Cloud, Contabo ...)</span>
                </button>
          </div> 
          <div className="shadow-md rounded-lg pb-2 pt-4 col-span-2 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
          <button
                title="Coming Soon"
                disabled
                type="button"
                onClick={() => Router.push("/newpeer")}
                className="cursor-not-allowed relative block w-full rounded-lg text-boring-black dark:text-boring-white p-12 text-center hover:border-gray dark:hover:border-gray focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <span className="font-jetbrains mt-2 block text-sm text-gray-dark dark:text-boring-white">Add Helium Hotspot Provider</span>
                <span className="font-jetbrains mt-2 block text-xs text-gray">Run a provider peer on network-connected Helium devices. coming soon...</span>
                </button>
          </div> 
        </div>
            
      </div>{/* end .main */}
  
        
        
    
      </div>{/* end main */}
    </LayoutAuthenticated>
  );
}



export default PeerPage
