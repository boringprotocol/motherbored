import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import LayoutDirectory from '../components/layoutDirectory'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { Component, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'

import PeerPublic, { PeerPublicProps } from '../components/peerPublic'
import CountryFilter from '../components/countryFilter'

// Providers table:
// import { Table } from '../components/providersTable.js'



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

  // const columns = [
  //   { accessor: 'name', label: 'Name' },
  //   { accessor: 'age', label: 'Age' },
  //   { accessor: 'is_manager', label: 'Manager', format: (value) => (value ? '✔️' : '✖️') },
  //   { accessor: 'start_date', label: 'Start Date' },
  // ]

  
  // const rows = [
  //   { id: 1, name: 'Liz Lemon', age: 36, is_manager: true, start_date: '02-28-1999' },
  //   { id: 2, name: 'Jack Donaghy', age: 40, is_manager: true, start_date: '03-05-1997' },
  //   { id: 3, name: 'Tracy Morgan', age: 39, is_manager: false, start_date: '07-12-2002' },
  //   { id: 4, name: 'Jenna Maroney', age: 40, is_manager: false, start_date: '02-28-1999' },
  //   { id: 5, name: 'Kenneth Parcell', age: Infinity, is_manager: false, start_date: '01-01-1970' },
  //   { id: 6, name: 'Pete Hornberger', age: 42, is_manager: true, start_date: '04-01-2000' },
  //   { id: 7, name: 'Frank Rossitano', age: 36, is_manager: false, start_date: '06-09-2004' },
  //   { id: 8, name: null, age: null, is_manager: null, start_date: null },
  // ]

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

        {/* <Table rows={rows} columns={columns} /> */}

          
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
