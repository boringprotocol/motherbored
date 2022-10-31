import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import LayoutDirectory from '../components/layoutDirectory'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { Component, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'

import PeerPublic, { PeerPublicProps } from '../components/PeerPublic'
import CountryFilter from '../components/countryFilter'



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
    // show all peers
    //where: { userId: user?.id },
  })
  return {
    props: { peers },
  }
}

type Props = {
  peers: PeerPublicProps[],
  providers: PeerPublicProps[],
}

const DirectoryPage: React.FC<Props> = (props) => {  

  const { data } = useSession(); 
  const { data: session, status } = useSession();
  if (!session) {

    return (

      // NOT AUTHENTICATED - Home Page Main Panel 🐈
      <LayoutDirectory>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <ul role="list" className="">
          {props.peers.map((peer) => (
            <li key={peer.name} className="">
              <PeerPublic peer={peer} />
            </li>
          ))}           
        </ul>
      </LayoutDirectory>
    );
  }
  return (

    // AUTHENTICATED - Home Page Main Panel 🐈
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png"/>
      </Head>


      <div className="fixed w-full flex p-6">
        <div className="z-10 bg-boring-white dark:bg-boring-black">
          .CSV | Country
        <CountryFilter />
        
        </div>
      </div>

      {/* Main content */}
      <div className="main p-8 text-xs">
      
        {/* PEERS */} 
      

        <div className="mt-12 flex flex-col">
            
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-lightest dark:divide-gray-dark">
              <thead className="bg-boring-white dark:bg-boring-black">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Provider
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Country
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      POA
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Consumers
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">
                        View
                        </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="mt-24 divide-y divide-gray-lightest dark:divide-gray-dark">
                {props.peers.map((peer) => (
                  <tr key={peer.name} className="p-12 hover:bg-gray-lightestest dark:hover:bg-gray-dark cursor-pointer" onClick={() => Router.push("/directory/p/[id]", `/directory/p/${peer.id}`)}>
                    <PeerPublic peer={peer} />
                  </tr>
                ))}          
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      </div>{/* end .main */}
  
    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default DirectoryPage
