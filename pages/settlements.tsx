import { getSession, useSession } from 'next-auth/react'
import Router from 'next/router'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { Connection, GetProgramAccountsFilter, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { GetPeersForPubkey } from "../lib/influx"

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {

    const session = await getSession({ req });
    if (!session || !session.user || !session.user.name) {
        res.statusCode = 403;
        return { props: {} }
    }

    const user = await prisma.user.findFirst({
        where: { wallet: session.user.name }
    })

    if (user == null || user.id == null) {
        res.statusCode = 403;
        return { props: {} }
    }

    const providerPeers = await prisma.peer.findMany({
        where: { kind: "provider", pubkey: { not: null } },
        select: {
            name: true,
            id: true,
            country_code: true,
            label: true,
            userId: true,
            pubkey: true,
        },
    })

    let allPeers: SettlePeer[] = []

    for (let p of providerPeers) {

        if (p.userId == null) {
            res.statusCode = 403;
            return { props: { peers: {} } }
        }
        if (p.pubkey == null) {
            res.statusCode = 403;
            return { props: { peers: {} } }
        }

        const connected = await GetPeersForPubkey(p.pubkey, '30d')
        console.log(connected)
        console.log("HELLO")
        const pUser = await prisma.user.findFirst({
            where: { id: p.userId }
        })
        if (pUser == null) {
            res.statusCode = 403;
            return { props: { peers: {} } }
        }
        if (p.name == null) {
            res.statusCode = 403;
            return { props: { peers: {} } }
        }
        allPeers.push({
            name: p.name,
            wallet: pUser?.wallet,
            connected: connected,
        })
    }

    // catchall return, consumers get here
    return {
        props: { peers: allPeers },
    };
};

type SettlePeer = {
    name: string,
    wallet: string,
    connected: string | unknown,
}

type Props = {
    peers: SettlePeer[],
}

const Settlements: React.FC<Props> = (props) => {

    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Authenticating ...</div>;
    }

    const userHasValidSession = Boolean(session);

    return (
        <LayoutAuthenticated>
            <div>
                <ul>
                    {props.peers.map((pp) => (
                        <div>
                            <li>{pp.name},{pp.wallet},{pp.connected}</li>
                        </div>
                    ))}
                </ul>
            </div>
        </LayoutAuthenticated>
    )
}

export default Settlements
