import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { Component, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'
import Table from 'react-tailwind-table'
import 'react-tailwind-table/dist/index.css'

import PeerPublic, { PeerPublicProps } from '../components/PeerPublic'



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

  const { data } = useSession(); // do we need this here? 
  const { data: session, status } = useSession();
  if (!session) {

    return (

      // NOT AUTHENTICATED - Home Page Main Panel 🐈
      <Layout>
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
        sjdkhflkjsdhlfjk
      </Layout>
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
    
      {/* Main content */}
      <div className="main pt-12 text-xs">
        
      {/* Maybe just add/remove a 'hidden' class on the rendered peer list item. Or probably useState though for back button  */}
      {/* <div className='p-12'>
      show peers: <a className="border p-1" href="#">all</a>, providers: <a className="border p-1" href="#">all</a> <a className="border p-1" href="#">local</a> <a className="border p-1" href="#">cloud</a> consumers: <a className="border p-1" href="#">all</a>
      </div> */}
      
        {/* PEERS */} 
        <div className="">
        <ul role="list" className="">
          {props.peers.map((peer) => (
            <li key={peer.name} className="">
              <PeerPublic peer={peer} />
            </li>
          ))}           
        </ul>

      </div>{/* end .main */}
  
    
      </div>{/* end main */}
    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default DirectoryPage
