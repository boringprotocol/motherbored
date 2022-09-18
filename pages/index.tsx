import { getSession, signOut, useSession } from "next-auth/react";
import Router from "next/router";
import Layout from "../components/layout";
import React from "react";
import { GetServerSideProps } from "next";
import Peer, { PeerProps } from "../components/Peer";
import prisma from "../lib/prisma";
import Link from "next/link";
import Head from 'next/head';
import Header from "../components/header";
import Image from 'next/image';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'



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


        <div className="rounded-md bg-boring-white dark:bg-boring-black p-4 mb-12 border border-boring-black dark:border-boring-white">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-boring-black dark:text-boring-white" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-boring-black dark:text-boring-white">Successfully did something</p>
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

      <div className="pb-12">
      <h3 className="text-lg font-medium leading-6 text-gray dark:text-boring-white uppercase">Network</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-sm text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black px-4 py-5 shadow-xl sm:p-6">
            <dt className="truncate text-sm text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl text-gray">{item.stat}</dd>
          </div>
        ))}
      </dl>
      </div>  

      <div className="pb-12">
      
        <button
      type="button"
      className="relative block w-full rounded-lg text-boring-black dark:text-boring-white border-2 border-dotted border-gray-light p-12 text-center hover:border-gray-dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          strokeWidth={2}
          d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
        />
      </svg>
      <span className="mt-2 block text-sm font-medium text-gray-900">Add a motherbored</span>
        </button>
      </div>
      
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
        <li className="col-span-1 rounded-sm text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black  shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">name</h3>
                <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  role
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">title</p>
            </div>
            <Image 
            src="https://source.boringavatars.com/marble/80/"
            alt="user image"
            width="20" 
            height="20"
            />
            {/* <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src="https://source.boringavatars.com/marble/80/" alt="" /> */}
          </div>
          <div>
          </div>
        </li>  
          
        </ul>   

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

      <div className="">
        

      <div className="flex border rounded-sm border-gray-light dark:border-gray-dark p-4 mb-12">
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

        
      <ul role="list" className="pb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {props.peers.map((peer) => (
            <Peer peer={peer} />
        ))}
      </ul>

    <div className="pb-12">
      
      <button
    type="button"
    onClick={() => Router.push("/newpeer")}
    className="relative block w-full rounded-lg text-boring-black dark:text-boring-white border-2 border-dotted border-gray-light dark:border-gray-dark p-12 text-center hover:border-gray focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        strokeWidth={2}
        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
      />
    </svg>
    <span className="font-jetbrains mt-2 block text-sm font-medium text-gray-900">Add Motherbored</span>
    
      </button>
    </div>

    <div className="pb-12">
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
