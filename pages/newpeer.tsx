import React, { useState } from "react";
import Layout from "../components/layout";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../lib/prisma";
import Peer, { PeerProps } from "../components/Peer";
import { json } from "stream/consumers";

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
        where: { kind: "provider", pubkey: { not: null } },
    })

    return {
        props: { peers },
    }
}

type Props = {
    peers: PeerProps[]
}

const NewPeer: React.FC<Props> = (props) => {
    const [name, setName] = useState("");
    const [kind, setKind] = useState("provider");
    const [target, setTarget] = useState("");

    function handleChangeKind(newKind: string) {
        if (newKind == "consumer") {
            setTarget(props.peers[0].id);
        }
        setKind(newKind);
    }

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { name: name, kind: kind, target: target };
            const response = await fetch("/api/peer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const resultData = await (response.json()) as any;
            console.log(resultData);
            if (response.ok) {
                await Router.push(`/p/${resultData.id}`);

            } else {
                await Router.push("/")
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div>
                <form onSubmit={submitData}>
                    <h1>New Peer</h1>
                    <input
                        id="name"
                        name="name"
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        type="text"
                        value={name}
                        required
                    />
                    <label htmlFor="mode" className="block text-sm font-medium">
                        Mode
                    </label>
                    <select
                        onChange={(e) => handleChangeKind(e.target.value)}
                        id="kind"
                        name="kind"
                        className="mt-1 block w-full rounded-md border-gray-light py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue="provider"
                    >
                        <option key="consumer" value="consumer">Consumer</option>
                        <option key="provider" value="provider">Provider</option>
                        required
                    </select>

                    {kind == "consumer" && (
                        <div>
                            <label htmlFor="target" className="block text-sm font-medium">
                                Select an available vpn provider:
                            </label>
                            <select
                                onChange={(e) => setTarget(e.target.value)}
                                id="target"
                                name="target"
                                className="mt-1 block w-full rounded-md border-gray-light py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                {props.peers.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <input type="submit" value="Create" />
                    <a className="back" href="#" onClick={() => Router.push("/")}>
                        or Cancel
                    </a>
                </form>
            </div>
            <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input[type="text"],
        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
        .back {
          margin-left: 1rem;
        }
      `}</style>
        </Layout >
    );
};

export { getServerSideProps }

export default NewPeer;
