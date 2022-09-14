import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { PeerProps } from "../../components/Peer";
import { getSession, useSession } from "next-auth/react";
import Layout from "../../components/layout";
import prisma from "../../lib/prisma";

// error in this code when run
// clues: https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    /*
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
    */


    if (params == null || params.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    const peer = await prisma.peer.findUnique({
        where: {
            id: String(params.id),
        },
    });

    if (peer == null || peer.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    const targetPeer = await prisma.peer.findUnique({
        where: {
            id: String(peer.target),
        },
    });

    if (targetPeer == null || targetPeer.name == null) {
        return { props: { peer: peer, target: "" } }
    }

    return {
        props: { peer: peer, target: targetPeer.name },
    };
};

type Props = {
    peer: PeerProps,
    target: string,
}

/*
async function publishPeer(id: string): Promise<void> {
    await fetch(`/api/peer/${id}`, {
        method: "PUT",
    });
    await Router.push("/");
}*/

const ShowPeer: React.FC<Props> = (props) => {
    const { data: session, status } = useSession();

    return (
        <Layout>
            <div>
                <h1 className="text-xl uppercase">Name: {props.peer.name}</h1>
                <li key={props.peer.id}>Id: {props.peer.id}</li>
                <li key={props.peer.setupkey}>boring setupkey: {props.peer.setupkey}</li>
                <li key={props.peer.kind}>kind: {props.peer.kind}</li>
                <li key={props.peer.target}>target: {props.target}</li>
            </div>
        </Layout>
    );
};

export default ShowPeer;
