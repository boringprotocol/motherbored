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

    //setName (props.peer.name)

    return (
        <Layout>
            <div>

            {/* <div className="flex">
  <div className="w-1/2 outline ">w-1/2</div>
  <div className="w-1/2 outline ">w-1/2</div>
</div> */}

            {/* The Current Peer */}
            <div className="grid grid-cols-2 gap-4 px-14 py-24 border-b border-gray-light dark:border-gray-dark">
            <div className="w-3/4">

                <form className="w-full" onSubmit={submitData}>

                    <div className="text-boring-white rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                    {/* <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    Name
                    </label> */}
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        className="cursor-not-allowed block w-full border-0 p-0 bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white focus:ring-0 text-4xl"
                        placeholder={name || ""}
                        disabled
                    />
                    </div>

                    <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    Label
                    </label>
                    <input
                        type="text"
                        name="label"
                        id="label"
                        onChange={(e) => setLabel(e.target.value)}
                        className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white block w-full border-0 p-0 focus:ring-0 text-lg"
                        placeholder={label || ""}
                    />
                    </div>

                    <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                    <IoWifiOutline className="float-left mr-2" /> SSID
                    </label>
                    <input
                        type="text"
                        name="ssid"
                        id="ssid"
                        onChange={(e) => setSSID(e.target.value)}
                        className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white block w-full border-0 p-0 focus:ring-0 text-lg"
                        placeholder={ssid || ""}
                    />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 flex justify-center rounded-sm border text-boring-black dark:text-boring-white border-boring-black dark:border-boring-white  py-2 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
                        onClick={() => Router.push("/")}
                        >
                        Save Changes
                    </button>

                </form>

            </div>

            <div className="w-1/4">
                <Image src={"https://source.boringavatars.com/sunset/" + name || "" + "?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"} alt="" width="48" height="48" /></div>
                <p>You are running this peer in <span className="text-gray underline">{props.peer.kind}</span> mode and are connected to <span className="text-gray underline">{props.target}</span></p>
            </div>


                {/* Advanced Configuration / Settings */}
                <div className="px-14 py-16 border-b border-gray-light dark:border-gray-dark">
                <h1 className="font-jetbrains text-2xl">Advanced Configuration</h1>
                <p className="text-sm">For peers that are not on your local network. </p>

                <div className="flex">
                    
                    <div className="w-1/2  ">
                    <ul className="mt-6 text-xs">
                        <li>Name: {props.peer.name}</li>
                        <li key={props.peer.id}>Id: {props.peer.id}</li>
                        <li key={props.peer.kind}>kind: {props.peer.kind}</li>
                        <li>SSID:</li>
                        <li key={props.peer.setupkey}>boring setupkey: {props.peer.setupkey}</li>
                        <li key={props.peer.target}>target: {props.target}</li>
                    </ul>
                    </div>

                    <div className="w-1/2  ">
                    <pre className="mt-6 text-sm">ssh 10.0.0.XX:XXXX</pre>
                    <ul className="mt-6 text-xs">
                        {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                    </ul>
                    <button className="mt-8 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2"/> boring.env</button>
                    {isProvider && !providerActive && (
                    <div>
                        <button className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-3 py-1 text-boring-black shadow hover:bg-gray-lightest" onClick={() => activatePeer(props.peer.id)}>Activate</button>
                    </div>
                )}
                {isProvider && providerActive && (
                    <div>
                        <h1>This provider is active and available to the network!</h1>
                    </div>
                )}
                    </div>
                </div>

                </div>





                {/* Advanced Configuration / Settings */}
                <div className="px-14 py-16 border-b border-gray-light dark:border-gray-dark">
                
<h1 className="font-jetbrains text-2xl mt-24">Danger Zone</h1>

    <div className="text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black border border-gray-lightest shadow sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium ">Destroy Peer</h3>
        <div className="mt-2 max-w-xl text-sm ">
          <p>Once you reset your peer, all data associated with it goes away, forever.</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="mt-6 flex justify-center rounded-sm border text-boring-black dark:text-boring-white border-boring-black dark:border-boring-white  py-2 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
          >
            Reset peer
          </button>

        </div>
        </div>
        </div>
    </div>    


            </div>
        </Layout>
    );
};

export default ShowPeer;
