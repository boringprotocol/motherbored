import { getSession, useSession } from "next-auth/react"
import Router from "next/router"
import Layout from "../components/layout"
import React from "react"
import { GetServerSideProps } from "next"
import Peer, { PeerProps } from "../components/Peer"
import prisma from "../lib/prisma"
import Head from 'next/head';
import Image from 'next/image';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { IoWarningOutline } from 'react-icons/io5';


// Placeholder data for peer stats
const stats = [
  { name: 'Consumers', stat: '54' },
  { name: 'Providers', stat: '30' },
  { name: 'Connections', stat: '48' },
]

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
  peers: PeerProps[]
}

const IndexPage: React.FC<Props> = (props) => {

  const { data } = useSession(); // do we need this? 
  const { data: session, status } = useSession();
  if (!session) {
    return (

      // NOT AUTHENTICATED - Home Page Main Panel 🐈
      <Layout>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <div className="bg-boring-white dark:bg-boring-black font-jetbrains">



        </div>

      </Layout>
    );
  }
  return (

    // AUTHENTICATED - Home Page Main Panel 🐈
    <Layout>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="main">


      <div className="px-14 pt-8">
        {/* ALERT
        https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus */}
        {/* Success */}
        <div className="animate-pulse flex border rounded-sm border-gray-light dark:border-gray-dark p-4 mb-4">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-boring-black dark:text-boring-white" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="font-jetbrains text-sm font-medium text-boring-black dark:text-boring-white">Successfully did something</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Failure */}
        <div className="flex border rounded-sm border-gray-light dark:border-gray-dark p-4 mb-12">
          <div className="flex-shrink-0">
            {/* <CheckCircleIcon className="h-5 w-5 text-boring-black dark:text-boring-white" aria-hidden="true" /> */}
            <IoWarningOutline className="h-5 w-5 text-boring-black dark:text-boring-white" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="font-jetbrains text-sm font-medium text-boring-black dark:text-boring-white">Oh dang all your funds have been drained idiot</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>  
          
        {/* PEERS */}
        {/* key={peer.name} has to be on the imideiate child element within a loop
        https://adhithiravi.medium.com/why-do-i-need-keys-in-react-lists-dbb522188bbb
        https://stackoverflow.com/questions/54401481/eslint-missing-key-prop-for-element-in-iterator-react-jsx-key */}
        <div className="px-14 pb-16">
        <h2 className="font-jetbrains uppercase mb-4">Peers</h2>
        <ul role="list" className="pb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {props.peers.map((peer) => (
            <li key={peer.name} className="col-span-1 border rounded-sm cursor-pointer hover:border-gray dark:hover:border-gray border-gray-lightest dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
              <Peer peer={peer} />
            </li>
          ))}
        </ul>

                {/* ADD PEER */}
                <div className="pb-12">
          
          <button
        type="button"
        onClick={() => Router.push("/newpeer")}
        className="relative block w-full rounded-lg text-boring-black dark:text-boring-white border-2 border-dotted border-gray-light dark:border-gray-dark p-12 text-center hover:border-gray dark:hover:border-gray focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Peer</span>
        
          </button>
        </div>
        </div>
      


        
        
        
        {/* NETWORK STATISTICS */}
        <div className="px-14 py-16 border-t border-gray-light dark:border-gray-dark">
        <h3 className="font-jetbrains text-lg font-medium leading-6 text-gray dark:text-boring-white uppercase">Network</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.name} className="font-jetbrains  overflow-hidden rounded-sm text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
          ))}
        </dl>
        </div>  
    
      </div>
      
    </Layout>
  );
}

export { getServerSideProps }

export default IndexPage
