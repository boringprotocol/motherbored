import React, { useState } from "react";
import Layout from "../components/layout";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../lib/prisma";
import Peer, { PeerProps } from "../components/Peer";
import { json } from "stream/consumers";
import { IoRefreshOutline } from "react-icons/io5"

var generate = require('boring-name-generator');

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
    const [name, setName] = useState(generate({ number: true }).dashed);
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
                <form className="w-1/2" onSubmit={submitData}>

                    <h1 className="uppercase mb-6">New Peer</h1>


                    <div className="border border-gray-dark text-boring-white rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                        <label htmlFor="name" className="block text-xs text-gray">
                            Peer Name
                        </label>


                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            className="cursor-not-allowed bg-boring-black block w-full border-0 p-0 text-gray-lightest placeholder-boring-white focus:ring-0 text-lg"
                            placeholder=""
                            value={name}
                            disabled
                        />
                    </div>
                    <div className="m-4 hover:text-gray active:text-gray-dark">
                        <a onClick={(e) => setName(generate({ number: true }).dashed)}><span className=""><IoRefreshOutline /></span></a>
                    </div>

                    <div className="mt-6 border border-gray-dark text-boring-white rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                        <label htmlFor="mode" className="block text-xs text-gray">
                            Mode
                        </label>
                        <select
                            onChange={(e) => handleChangeKind(e.target.value)}
                            id="kind"
                            name="kind"
                            className="bg-boring-black block w-full border-0 p-0 text-gray-lightest placeholder-boring-white focus:ring-0 text-lg"
                            defaultValue="provider"
                        >
                            <option key="consumer" value="consumer">Consumer</option>
                            <option key="provider" value="provider">Provider</option>
                            required
                        </select>
                    </div>

                    {kind == "consumer" && (
                        <div>


                            {/* https://tailwindui.com/components/application-ui/forms/select-menus#component-71d9116be789a254c260369f03472985 */}
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

                    <input className="float-left  mt-6 flex justify-center rounded-md border border-transparent  py-2 px-4 text-sm text-gray shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40" type="submit" value="Create" />
                    <a className="back" onClick={() => Router.push("/")}>
                        <span className="text-xs float-left ml-6 mt-8">or Cancel</span>
                    </a>
                </form>
            </div>

        </Layout >
    );
};

export { getServerSideProps }

export default NewPeer;
