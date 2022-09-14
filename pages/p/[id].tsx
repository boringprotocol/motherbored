import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { PeerProps } from "../../components/Peer";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout";
import { PaperClipIcon } from '@heroicons/react/20/solid'
import prisma from "../../lib/prisma";

// error in this code when run
// clues: https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const peer = await prisma.peer.findUnique({
        where: {
            id: String(params?.id),
        },
    });
    return {
        props: peer,
    };
};


/*
async function publishPeer(id: string): Promise<void> {
    await fetch(`/api/peer/${id}`, {
        method: "PUT",
    });
    await Router.push("/");
}*/

const ShowPeer: React.FC<PeerProps> = (props) => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div className="text-green">Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    let title = props.name;

    return (
        <Layout>
            <div>
                <h1 className="text-xl uppercase">Name: {props.name}</h1>
                <li key={props.id}>Id: {props.id}</li>
                <li key={props.setupkey}>boring setupkey: {props.setupkey}</li>
                <li key={props.kind}>kind: {props.kind}</li>
                {props.target && (<li key={props.target}>target: {props.target}</li>)}
            </div>
        </Layout>
    );
};

export default ShowPeer;
