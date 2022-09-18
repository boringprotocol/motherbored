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
                <li>SSID:</li>
                <li key={props.peer.setupkey}>boring setupkey: {props.peer.setupkey}</li>
                <li key={props.peer.kind}>kind: {props.peer.kind}</li>
                <li key={props.peer.target}>target: {props.target}</li>
                {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                <button className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-3 py-2 font-medium text-boring-black shadow hover:bg-boring-white" onClick={() => downloadPeerConfig(props.peer.id)}>Download boring config</button>
                {isProvider && !providerActive && (
                    <div>
                        <button className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-3 py-2 font-medium text-boring-black shadow hover:bg-boring-white" onClick={() => activatePeer(props.peer.id)}>Activate</button>
                    </div>
                )}
                {isProvider && providerActive && (
                    <div>
                        <h1>This provider is active!</h1>
                    </div>
                )}

<div className="bg-boring-white dark:bg-boring-black border border-gray-dark shadow sm:rounded-lg mt-12">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-boring-white">Reset Peer</h3>
        <div className="mt-2 max-w-xl text-sm text-boring-white">
          <p>Once you reset your peer, all data associated with it goes away , "factory reset", ... </p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="focus:bg-blue focus:shadow-lg focus:outline-none focus:ring-0 active:bg-black active:shadow-lg inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-boring-white hover:bg-boring-white hover:text-boring-black focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
          >
            Reset peer
          </button>
        </div>
      </div>
    </div>


            </div>
        </Layout>
    );
};

export default ShowPeer;
