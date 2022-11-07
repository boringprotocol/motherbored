import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import LayoutDirectory from '../components/layoutDirectory'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { Component, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { GetPeersForPubkey } from "../lib/influx"
import PeerPublic, { PeerPublicProps } from '../components/peerPublic'
import CountryFilter from '../components/countryFilter'

// Providers table:
import { Table } from '../components/providersTable.js'



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
    where: { pubkey: { not: null } },
  })

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

type PeerWithStats = {
  name: string | null;
  country_code: string | null;
  connected_peers: string | null;
}

type Props = {
  peers: PeerPublicProps[],
  peersWithStats: PeerWithStats[],
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
      </LayoutDirectory>
    );
  }
  const columns = [{ accessor: "name", label: "Name" }, { accessor: "country_code", label: "Country" }, { accessor: "connected_peers", label: "connected" }]
  return (

    // AUTHENTICATED - Home Page Main Panel 🐈
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>


      <div className="fixed w-full flex p-6">
        <div className="z-10 bg-boring-white dark:bg-boring-black">

          <Table rows={props.peersWithStats} columns={columns} />


          <CountryFilter />

        </div>
      </div>


    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default DirectoryPage
