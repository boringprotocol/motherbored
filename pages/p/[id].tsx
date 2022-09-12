import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { PeerProps } from "../../components/Peer";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Layout from "../../components/layout";

/*
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
*/

/*
async function publishPeer(id: string): Promise<void> {
    await fetch(`/api/peer/${id}`, {
        method: "PUT",
    });
    await Router.push("/");
}*/

const Peer: React.FC<PeerProps> = (props) => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    let title = props.name;

    return (
        <Layout>
            <div>
                <li>Name: {props.name}</li>
                <li>Id: {props.id}</li>
                <li>netbird setupkey: {props.setupkey}</li>
                <li>kind: {props.kind}</li>
            </div>
        </Layout>
    );
};

export default Peer;