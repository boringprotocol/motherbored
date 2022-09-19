import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { PeerProps } from "../../components/Peer";
import Layout from "../../components/layout";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { IoDownloadOutline, IoWifiOutline } from "react-icons/io5"
import Image from 'next/image';

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
    // here dude - update components/Peer.tsx to make mroe of these babies
    const [name, setName] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const id=props.peer.id;

    const submitData = async (e: React.SyntheticEvent) => {
        console.log (label)
        e.preventDefault();
        
        try {
            const body = { id: id, name: name, label: label, ssid: ssid };
            const response = await fetch(`/api/peer/${id}`, {
                method: "PUT",
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

            <div className="grid grid-cols-2 gap-4">
            <div className="w-3/4">

                <form className="" onSubmit={submitData}>

                    <div className="text-boring-white rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                    {/* <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    Name
                    </label> */}
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        className="cursor-not-allowed bg-boring-black block w-full border-0 p-0 text-boring-white placeholder-boring-white focus:ring-0 text-4xl"
                        placeholder={name}
                        disabled
                    />
                    </div>

                    <div className="text-boring-white border border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    Label
                    </label>
                    <input
                        type="text"
                        name="label"
                        id="label"
                        onChange={(e) => setLabel(e.target.value)}
                        className="bg-boring-black block w-full border-0 p-0 text-boring-white placeholder-boring-white focus:ring-0 text-lg"
                        placeholder={label}
                    />
                    </div>

                    <div className="mt-6 text-boring-white border border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    <IoWifiOutline className="float-left mr-2" /> SSID
                    </label>
                    <input
                        type="text"
                        name="ssid"
                        id="ssid"
                        onChange={(e) => setSSID(e.target.value)}
                        className="bg-boring-black block w-full border-0 p-0 text-boring-white placeholder-boring-white focus:ring-0 text-lg"
                        placeholder={ssid}
                    />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 flex justify-center rounded-md border border-transparent  py-2 px-4 text-sm text-gray shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
                        >
                        Save Changes
                    </button>

                </form>

            </div>

            <div className="w-1/4">
                <Image src="https://source.boringavatars.com/pixel/o9k7o789n6o7" alt="" width="148" height="148" /></div>
            </div>


                <hr className="bt-1 border-gray-dark m-12"/>

                <p className="font-jetbrains text-xs">These list items are just here for reference. I need to figure out how to pass these values into the form attributes above. I know they are not meant to be editable but if ALL items per peer live in one form we can just disable the fixed values. The submit button should be disabled/muted until a form value has changed. </p>
                <li>Name: {props.peer.name}</li>
                <li key={props.peer.id}>Id: {props.peer.id}</li>
                <li key={props.peer.kind}>kind: {props.peer.kind}</li>

                <hr className="bt-1 border-gray-dark m-12"/>


                <p className="font-jetbrains text-xs">These list items are also for reference. We can look at adding columns to the peer table to prepare for the future implimentation.</p>


                <li>SSID:</li>
                <li key={props.peer.setupkey}>boring setupkey: {props.peer.setupkey}</li>
                <li key={props.peer.target}>target: {props.target}</li>

                <hr className="bt-1 border-gray-dark m-12"/>


                <p className="font-jetbrains text-xs">Manual setup buttons</p>


                {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                <button className="mt-8 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2"/> boring.env</button>
                {isProvider && !providerActive && (
                    <div>
                        <button className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-3 py-1 text-boring-black shadow hover:bg-gray-lightest" onClick={() => activatePeer(props.peer.id)}>Activate</button>
                    </div>
                )}
                {isProvider && providerActive && (
                    <div>
                        <h1>This provider is active!</h1>
                    </div>
                )}


<hr className="bt-1 border-gray-dark m-12"/>

<p className="font-jetbrains text-xs">This might be a good place to put the are-your-sure kill/reset button. </p>

<div className="bg-boring-white dark:bg-boring-black border border-gray-dark shadow sm:rounded-lg mt-12">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-boring-white">Reset Peer</h3>
        <div className="mt-2 max-w-xl text-sm text-boring-white">
          <p>Once you reset your peer, all data associated with it goes away , factory reset, ... </p>
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
