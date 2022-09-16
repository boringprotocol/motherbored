import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { PeerProps } from "../../components/Peer";
import Layout from "../../components/layout";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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

async function activatePeer(id: string): Promise<void> {
    await fetch(`/api/activate/${id}`, {
        method: "PUT",
    });
    await Router.push(`/p/${id}`);
}

async function downloadPeerConfig(id: string): Promise<void> {
    //await fetch(`/api/config/${id}`, {
    //    method: "GET",
    //});
    await Router.push(`/api/config/${id}`);
}

const ShowPeer: React.FC<Props> = (props) => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Authenticating ...</div>;
    }

    let providerActive = false
    if (props.peer.pubkey != null) {
        providerActive = true
    }

    let isProvider = false
    if (props.peer.kind == "provider") {
        isProvider = true
    }

    const userHasValidSession = Boolean(session);

    return (
        <Layout>
            <div>
                <h1 className="text-xl uppercase">Name: {props.peer.name}</h1>
                <li key={props.peer.id}>Id: {props.peer.id}</li>
                <li key={props.peer.setupkey}>boring setupkey: {props.peer.setupkey}</li>
                <li key={props.peer.kind}>kind: {props.peer.kind}</li>
                <li key={props.peer.target}>target: {props.target}</li>
                {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                <button onClick={() => downloadPeerConfig(props.peer.id)}>Download boring config</button>
                {isProvider && !providerActive && (
                    <div>
                        <h1>This provider is inactive, you must activate it after configuring the motherbored.</h1>
                        <button onClick={() => activatePeer(props.peer.id)}>Activate</button>
                    </div>
                )}
                {isProvider && providerActive && (
                    <div>
                        <h1>This provider is active!</h1>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ShowPeer;
