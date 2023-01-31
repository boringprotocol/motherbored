import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import LayoutDirectory from '../components/layoutDirectory'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { Component, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { GetPeersForPubkey } from "../lib/influx"
// import CountryFilter from '../components/countryFilter'

import memoryCache from '../lib/memory_cache';

// Providers table:
import { Table } from '../components/providersTable.js'


console.log(`Cache before setting: ${memoryCache.getStats()}`);
// memoryCache.set('peers', peers, 60);
console.log(`Cache after setting: ${memoryCache.getStats()}`);

console.log(`Cache before getting: ${memoryCache.getStats()}`);
let peers = memoryCache.get('peers');
console.log(`Cache after getting: ${memoryCache.getStats()}`);


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

  let peers = memoryCache.get('peers')
  if (peers == undefined) {
    peers = await prisma.peer.findMany({
      // show all peers
      where: { pubkey: { not: null } },
    })
    memoryCache.set('peers', peers, 60)
  }
  


  let peersWithStats: PeerWithStats[] = []

  //peers.forEach((value, key, map) => {
  for (const value of peers) {

    if (value.pubkey != null) {

      const myStat: any = await GetPeersForPubkey(value.pubkey, "5m")

      if (myStat != null) {

        let myRealStat = "0"
        if (myStat.length != 0) {
          myRealStat = myStat[0]._value
        }

        const newPeer = {
          name: value.name,
          country_code: value.country_code,
          connected_peers: myRealStat,
        }

        peersWithStats.push(newPeer)
      }
    }

  }
  //})

  return {
    props: { peersWithStats },
  }
}

type Props = {
  peersWithStats: PeerWithStats[],
}

type PeerWithStats = {
  name: string | null;
  country_code: string | null;
  connected_peers: string | null;
}

const DirectoryPage: React.FC<Props> = (props) => {

  const { data } = useSession();
  const { data: session, status } = useSession();
  if (!session) {

    return (

      // Not Authenticated
      <LayoutDirectory>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      </LayoutDirectory>
    );
  }
  const columns = [{ accessor: "name", label: "Name" }, { accessor: "country_code", label: "Country" }, { accessor: "connected_peers", label: "Connected" }]
  return (

    // Authenticated
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      <Table rows={props.peersWithStats} columns={columns} />

    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default DirectoryPage


