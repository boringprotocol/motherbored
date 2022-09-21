import React, { useState } from "react"
import { GetServerSideProps } from "next"
import Router from "next/router"
import Peer, { PeerProps } from "../../components/Peer"
import Layout from "../../components/layout"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import { IoDownloadOutline, IoWifiOutline } from "react-icons/io5"
import Image from 'next/image'
// import { toNamespacedPath } from "path"
import toast, { Toaster } from 'react-hot-toast'

import { CheckIcon } from '@heroicons/react/24/solid'

const steps = [
    { id: '01', name: 'Peer Creation', description: 'Please configure your peer next.', href: '#', status: 'complete' },
    { id: '02', name: 'Configure', description: 'install config.', href: '#', status: 'current' },
    { id: '03', name: 'Activate', description: 'Penatibus eu quis ante.', href: '#', status: 'upcoming' },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

// Deleting Peer / "Reset"
async function deletePeer(id: string): Promise<void> {
    const body = { id: id }
    const result = await fetch(`/api/peer/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (result.ok) {
        toast.success("success bro you deleted haha meet me at 830");
    } else {
        notify("your funds have been drained idiot");
    }
    await Router.push(`/`);
}


// Success: Node created, Node deleted, node modified, activated(provider), /configured
// Error: timeout, form contents are gross don't type that way... that name already exists / conflicts 

// Toast Shit - later move to a file of its own
const notify = (message: string) =>
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-boring-black shadow-lg border-green rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <img
                            className="h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {message}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Sure! 8:30pm works great!
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    ))
// End Toast Shit




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
    const result = await fetch(`/api/activate/${id}`, {
        method: "PUT",
    });
    if (result.ok) {
        toast.success("success bro");
    } else {
        notify("your funds have been drained idiot");
    }
    await Router.push(`/p/${id}`);
}

async function downloadPeerConfig(id: string): Promise<void> {
    //await fetch(`/api/config/${id}`, {
    //    method: "GET",
    //});
    await Router.push(`/api/config/${id}`);
}

async function shovePeerConfig(id: string): Promise<void> {
    const results = await fetch(`/api/config/${id}`, {
        method: "GET",
    });
    notify("attempting to configure motherbored please wait 30 seconds..")
    if (results.ok) {
        const text = await results.text();
        const sendItURI = "https://unconfigured.insecure.boring.surf/api/hello?falconconfig=" + encodeURIComponent(text);
        try {
            const sendIt = await fetch(sendItURI, {
                method: "GET",
                mode: "no-cors",
            });
            if (sendIt.status == 200) {
                notify("WE did it, boring.network is configured, please reboot")
            } else {
                notify("something went wrong trying to configure boring.network")
            }
        } catch {
            notify("ERROR: dns resolution for boring.surf failed")
        }
    } else {
        notify("ERROR: results were NOT OK")
    }
}

const ShowPeer: React.FC<Props> = (props) => {
    // here dude - update components/Peer.tsx to make mroe of these babies
    const [name, setName] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const id = props.peer.id;

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { id: id, name: name, label: label, ssid: ssid };
            const response = await fetch(`/api/peer/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.ok) { notify("Peer Saved!") }
            const resultData = await (response.json()) as any;
            if (response.ok) {
                await Router.push(`/p/${resultData.id}`);

            } else {
                await Router.push("/")
            }
        } catch (error) {
            console.error(error);
            notify("ERROR occured while saving settings!");
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
                <div>
                    <Toaster />
                </div>

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
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    <div className="w-1/4">
                        <Image src={"https://source.boringavatars.com/sunset/" + name || "" + "?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"} alt="" width="48" height="48" />
                    </div>
                    <div>
                        {props.peer.kind == "provider" && (<p className="text-xs" >You are running this peer in <span className="text-gray underline">{props.peer.kind}</span> mode </p>)}
                        {props.peer.kind == "consumer" && (<p className="text-xs" >You are running this peer in <span className="text-gray underline">{props.peer.kind}</span> mode and are connected to <span className="text-gray underline">{props.target}</span></p>)}
                        <ul className="text-xs">
                            <li key={props.peer.id}>Id: {props.peer.id}</li>
                            <li key={props.peer.kind}>Kind: {props.peer.kind}</li>
                            <li key={props.peer.setupkey}>Boring Setupkey: {props.peer.setupkey}</li>
                            <li key={props.peer.pubkey}>Boring Pubkey: {props.peer.pubkey}</li>
                        </ul>
                    </div>


                </div>

                <div className="lg:border-t lg:border-b border lg:border-gray-dark">
                    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
                        <ol
                            role="list"
                            className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-dark"
                        >
                            {steps.map((step, stepIdx) => (
                                <li key={step.id} className="relative overflow-hidden lg:flex-1">
                                    <div
                                        className={classNames(
                                            stepIdx === 0 ? 'border-b-0 rounded-t-md' : '',
                                            stepIdx === steps.length - 1 ? 'border-t-0 rounded-b-md' : '',
                                            'border border-gray overflow-hidden lg:border-0'
                                        )}
                                    >
                                        {step.status === 'complete' ? (
                                            <a href={step.href} className="group">
                                                <span
                                                    className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={classNames(
                                                        stepIdx !== 0 ? 'lg:pl-9' : '',
                                                        'px-6 py-5 flex items-start text-sm font-medium'
                                                    )}
                                                >
                                                    <span className="flex-shrink-0">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                                                            <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                        </span>
                                                    </span>
                                                    <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                                                        <span className="text-sm">{step.name}</span>
                                                        <span className="text-xs text-gray">{step.description}</span>
                                                    </span>
                                                </span>
                                            </a>
                                        ) : step.status === 'current' ? (
                                            <a href={step.href} aria-current="step">
                                                <span
                                                    className="absolute top-0 left-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={classNames(
                                                        stepIdx !== 0 ? 'lg:pl-9' : '',
                                                        'px-6 py-5 flex items-start text-sm font-medium'
                                                    )}
                                                >
                                                    <span className="flex-shrink-0">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                                                            <span className="text-indigo-600">{step.id}</span>
                                                        </span>
                                                    </span>
                                                    <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                                                        <span className="text-sm font-medium text-indigo-600">{step.name}</span>
                                                        <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                                    </span>
                                                </span>
                                            </a>
                                        ) : (
                                            <a href={step.href} className="group">
                                                <span
                                                    className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={classNames(
                                                        stepIdx !== 0 ? 'lg:pl-9' : '',
                                                        'px-6 py-5 flex items-start text-sm font-medium'
                                                    )}
                                                >
                                                    <span className="flex-shrink-0">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                                                            <span className="text-gray-500">{step.id}</span>
                                                        </span>
                                                    </span>
                                                    <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                                                        <span className="text-sm font-medium text-gray-500">{step.name}</span>
                                                        <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                                    </span>
                                                </span>
                                            </a>
                                        )}

                                        {stepIdx !== 0 ? (
                                            <>
                                                {/* Separator */}
                                                <div className="absolute inset-0 top-0 left-0 hidden w-3 lg:block" aria-hidden="true">
                                                    <svg
                                                        className="h-full w-full text-gray-dark"
                                                        viewBox="0 0 12 82"
                                                        fill="none"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                                                    </svg>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>

                {/* Reg Configuration / Settings */}
                <div className="px-14 py-16 border-b border-gray-light dark:border-gray-dark">
                    <h1 className="font-jetbrains text-2xl">Configuration</h1>
                    <p className="text-sm">Initial Motherbored configuration</p>

                    <div className="flex">
                        <div className="w-1/2  ">

                            {isProvider && !providerActive && (
                                <div>
                                    <p className="mt-6 text-sm">Turn on your motherbored, and connect to the boring WIFI network.  Password: motherbored</p>
                                    <ul className="mt-6 text-xs">
                                        {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                                    </ul>
                                    <button className="mt-8 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => shovePeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> install config</button>
                                    <p className="mt-6 text-sm">Once connected to boring WIFI... click install ^^</p>
                                    <button className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-3 py-1 text-boring-black shadow hover:bg-gray-lightest" onClick={() => activatePeer(props.peer.id)}>Activate</button>
                                    <p className="mt-6 text-sm">Then, wait a few minutes for your motherbored to reboot and then click activate ^^</p>
                                </div>
                            )}
                            {!isProvider && (
                                <div>
                                    <pre className="mt-6 text-sm">Turn on your motherbored, and connect to the boring WIFI network.  Password: motherbored</pre>
                                    <button className="mt-8 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => shovePeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> install config</button>
                                    <pre className="mt-6 text-sm">Once connected to boring WIFI... click install ^^</pre>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Advanced Configuration / Settings */}
                <div className="px-14 py-16 border-b border-gray-light dark:border-gray-dark">
                    <h1 className="font-jetbrains text-2xl">Advanced Configuration</h1>
                    <p className="text-sm">For peers that are not on your local network. You can configure your motherbored by copying a file to your sdcard (see below)</p>

                    <div className="flex">



                        <div className="w-1/2  ">
                            <pre className="mt-6 text-sm">First, download the boring.env file</pre>
                            <ul className="mt-6 text-xs">
                                {props.peer.pubkey && (<li key={props.peer.pubkey}>pubkey: {props.peer.pubkey}</li>)}
                            </ul>
                            <button className="mt-8 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> boring.env</button>

                            <pre className="mt-6 text-sm">Copy the boring.env file to the SDCARDs boot partition.</pre>
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
                                <form>
                                    <button
                                        type="button"
                                        className="mt-6 flex justify-center rounded-sm border text-boring-black dark:text-boring-white border-boring-black dark:border-boring-white  py-2 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
                                        onClick={() => deletePeer(props.peer.id)}
                                    >
                                        Reset peer
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </Layout>
    );
};

export default ShowPeer;
