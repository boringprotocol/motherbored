import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { GetServerSideProps } from 'next'
import Peer, { PeerProps } from '../components/Peer'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { IoLogoApple, IoLogoWindows } from 'react-icons/io5'
import { VscTerminalLinux } from "react-icons/vsc";
import Waiting from '../components/art/waiting'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'


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

const IndexPage: React.FC<Props> = (props) => {

  

  // const { data } = useSession(); // do we need this here? 
  const { data: session } = useSession();
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


  let content;
  if (props.peers.length === 0) {
    content = <div className="p-12">You don't have any peers setup yet. If you want to mine, setup up a provider. If you want to browser the internet through a our dVPN choose a consumer.<Waiting /></div>;
  } else if (props.peers.length === 1) {
    content = <div className="p-12">You have one peer</div>;
  } else if (props.peers.length >= 2 && props.peers.length < 5) {
    content = <div className="p-12">You have {props.peers.length} peers. nice! </div>;
  } else if (props.peers.length >= 5) {
    content = <div className="px-4 sm:px-6 md:px-12 pb-4">
    <div className="rounded-md bg-gray-50 p-4 border border-gray-light dark:border-gray-dark">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-800">Whoa dang!</h3>
          <div className="mt-2 text-xs text-gray-700">
            <p>You have many peers bro! Maybe you want to try your hand and running some of the experimental peer types?</p>
          </div>
        </div>
      </div>
    </div></div>;
  }

  return (

    // AUTHENTICATED - Home Page Main Panel 🐈
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored - Boring Protocol</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      {/* Main content */}
      <div className="main pt-12 text-xs">

        {/* PEERS */}

         {content}
       
        <div className="px-4 sm:px-8 md:px-12 pb-16">
        <ul role="list" className=" pb-12 grid grid-cols-2 gap-6 md:grid-cols-4 2xl:grid-cols-6">
          {props.peers.map((peer) => (
            <li key={peer.name} className="shadow-md col-span-2 border rounded-sm cursor-pointer hover:border-gray dark:hover:border-gray border-gray-lightest dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
              <Peer peer={peer} />
            </li>
          ))}     
            <li className="shadow-md rounded-lg pb-2 pt-4 col-span-2 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
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
                <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Motherbored/Pi Provider</span>
                <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your Motherbored/Pi to run as provider peer.</span>
                </button>
          </li>
          <li className="shadow-md rounded-lg pb-2 pt-4 col-span-2 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
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
            </li>
            <li className="rounded-md pb-2 pt-4 col-span-2 border border-dashed border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                  <button
                  type="button"
                  onClick={() => Router.push("/newpeer?mode=consumer")}
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
                  <span className="font-jetbrains mt-2 block text-xs text-gray">Configure your Motherbored/Pi to run as a consumer peer.</span>
                  </button>
          </li>{/* /#add-peer */}
            <li className="shadow-md rounded-lg pb-2 pt-4 col-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                  <button
                  type="button"
                  onClick={() => Router.push("/newpeer?mode=consumer")}
                  className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                  
                  <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add <IoLogoApple className="float-left"/> Macintosh Consumer</span>
                  <span className="font-jetbrains mt-2 block text-xs text-gray">Configure a VPN for OS X</span>
                  </button>
          </li>{/* /#add-peer */}
          <li className="shadow-md rounded-lg pb-2 pt-4 col-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                  <button
                  type="button"
                  onClick={() => Router.push("/newpeer?mode=consumer")}
                  className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                  
                  <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add <IoLogoWindows className="float-left"/> Windows Consumer</span>
                  <span className="font-jetbrains mt-2 block text-xs text-gray">Configure a VPN for your Windows machine</span>
                  </button>
          </li>{/* /#add-peer */}
          <li className="shadow-md rounded-lg pb-2 pt-4 col-span-1 border border-gray-light dark:border-gray-dark hover:border-gray dark:hover:border-gray">
                  <button
                  type="button"
                  onClick={() => Router.push("/newpeer?mode=consumer")}
                  className="relative block w-full rounded-lg text-boring-black dark:text-boring-white  p-12 text-center  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                  
                  <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add  
                  <VscTerminalLinux className="float-left" /> Linux Consumer</span>
                  <span className="font-jetbrains mt-2 block text-xs text-gray">Configure a VPN to run on Linux</span>
                  </button>
          </li>{/* /#add-peer */}
          </ul>
        </div>
      </div>
    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default IndexPage
