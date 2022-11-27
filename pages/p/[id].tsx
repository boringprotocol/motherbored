import React, { useState, Fragment } from "react"
import { GetServerSideProps } from "next"
import Router from "next/router"
import Peer, { PeerProps } from "../../components/Peer"
import LayoutAuthenticated from "../../components/layoutAuthenticated"
import prisma from "../../lib/prisma"
import { useSession, getSession } from "next-auth/react"
import { IoMapOutline, IoKey, IoDownloadOutline, IoWifiOutline, IoCloudUploadOutline, IoServerOutline, IoText, IoFileTrayFull, IoBugOutline, IoRefreshOutline, IoArrowBack } from "react-icons/io5"
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify'
import CountryCodes from "../../data/country_codes"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'



import Avatar from "boring-avatars"
import { useTheme } from "next-themes"
import Link from "next/link"
import TrafficStats from "../../components/trafficStats"
import { GetStatsForPubkey, GetPeersForPubkey } from "../../lib/influx"


// this old thing seems to want to live on every page
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {

    const session = await getSession({ req });
    if (!session || !session.user || !session.user.name) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    const user = await prisma.user.findFirst({
        where: { wallet: session.user.name }
    })

    if (user == null || user.id == null) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    if (params == null || params.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    if (params.id == null) {
        res.statusCode = 403;
        return { props: { peer: {} } }
    }

    const paramsId = String(params.id)

    const peer = await prisma.peer.findFirst({
        where: {
            id: { equals: paramsId, },
            userId: { equals: user.id, },
        }
    });

    if (peer == null || peer.id == null) {
        return { props: { peer: {}, target: "" } }
    }

    const targetPeer = await prisma.peer.findUnique({
        where: {
            id: String(peer.target),
        },
        select: {
            name: true,
            id: true,
            country_code: true,
            label: true,
        },
    });

    const providerPeers = await prisma.peer.findMany({
        where: { kind: "provider", pubkey: { not: null } },
        select: {
            name: true,
            id: true,
            country_code: true,
            label: true,
        },
    })

    // we're a provider, return stats and no target
    if (peer.kind == "provider" && peer.pubkey != null) {
        const statsData = await GetStatsForPubkey(peer.pubkey)
        const peerCount5m = await GetPeersForPubkey(peer.pubkey, '5m')
        const peerCount7d = await GetPeersForPubkey(peer.pubkey, '7d')

        //console.log(statsData)
        return { props: { peer: peer, stats: statsData, providerPeers: providerPeers, peerCount5m: peerCount5m, peerCount7d: peerCount7d } }
    }

    // somehow we are a consumer with no target, return early w/no target
    if (targetPeer == null || targetPeer.name == null) {
        return { props: { peer: peer, providerPeers: providerPeers } }
    }

    // catchall return, consumers get here
    return {
        props: { peer: peer, target: targetPeer, providerPeers: providerPeers },
    };
};

type Props = {
    peer: PeerProps,
    target: PeerProps,
    providerPeers: PeerProps[],
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
        toast('Peer Deleted', { containerId: 'PeerSavedNotification' })
    } else {
        // notify("Oh no! We couldn't delete this peer. Try again.");
        toast('Oh no! We couldnt delete this peer. Try again', { containerId: 'PeerSavedNotification' })
    }
    await Router.push(`/`);
}

// Activate peer
async function activatePeer(id: string): Promise<void> {
    const result = await fetch(`/api/activate/${id}`, {
        method: "PUT",
    });
    if (result.ok) {
        toast('Great news. Successfully activated!', { containerId: 'PeerSavedNotification' })
    } else {
        toast('Activation failed', { containerId: 'PeerSavedNotification' })
    }
    //await Router.push(`/p/${id}`);
}

// download boring.env config file
async function downloadPeerConfig(id: string): Promise<void> {
    //await fetch(`/api/config/${id}`, {
    //    method: "GET",
    //});
    await Router.push(`/api/config/${id}`);
}

// send boring.env config file to motherbored
async function shovePeerConfig(id: string): Promise<void> {
    const results = await fetch(`/api/config/${id}`, {
        method: "GET",
    });
    //notify("We're attempting to configure your Motherbored. Please wait 30 seconds or so...")
    if (results.ok) {
        const text = await results.text();
        const sendItURI = "https://unconfigured.insecure.boring.surf/api/hello?falconconfig=" + encodeURIComponent(text);
        try {
            const sendIt = await fetch(sendItURI, {
                method: "GET",
            });
            if (sendIt.ok) {
                // notify("We did it! boring.network is configured, please reboot")

                toast('We did it! boring.network is configured, rebooting', { containerId: 'PeerSavedNotification' })
            } else {
                // notify("something went wrong trying to configure boring.network")
                toast('something went wrong trying to configure boring.network', { containerId: 'PeerSavedNotification' })
            }
        } catch {
            // notify("ERROR: dns resolution for boring.surf failed")
            toast('ERROR: dns resolution for boring.surf failed, are you SURE you connected to boring WiFi?', { containerId: 'PeerSavedNotification' })
        }
    } else {
        //notify("ERROR: results were NOT OK")
        toast('ERROR: results were NOT OK', { containerId: 'PeerSavedNotification' })
    }
}

const ShowPeer: React.FC<Props> = (props) => {

    // generating peer avatoar from the id as opposed to the label
    const peerAvatar = props.peer.id

    // here dude - update components/Peer.tsx to make mroe of these babies
    const [name, setName] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const [country_code, setSelectedCountryCode] = useState(props.peer.country_code)
    const [wifi_preference, setSelectedWifiPreference] = useState(props.peer.wifi_preference)
    const [wpa_passphrase, setSelectedWPAPassphrase] = useState(props.peer.wpa_passphrase)
    const [target, setTarget] = useState(props.target);
    if (target == null) {
        setTarget(props.providerPeers[0])
    }
    const [channel, setChannel] = useState(props.peer.channel);
    const id = props.peer.id;

    const wifi_preferences = ["2.4Ghz"] // future support:, "5Ghz"]
    const channels24 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { id: id, name: name, label: label, ssid: ssid, country_code: country_code, wifi_preference: wifi_preference, wpa_passphrase: wpa_passphrase, target: target.id, channel: channel };
            const response = await fetch(`/api/peer/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            //Peer Saved
            if (response.ok) { toast('Changes Saved.  Install Config to activate', { containerId: 'PeerSavedNotification' }) }

            const resultData = await (response.json()) as any;
            if (response.ok) {
                await Router.push(`/p/${resultData.id}`);

            } else {
                await Router.push("/")
            }
        } catch (error) {
            console.error(error);
            //       notify("ERROR occured while saving settings!");
        }
    };

    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Authenticating ...</div>;
    }

    if (!session) {
        Router.push("/")
        return <div>no session</div>;
    }

    let providerActive = false
    if (props.peer.pubkey != null) {
        providerActive = true
    }

    let isProvider = false
    if (props.peer.kind == "provider") {
        isProvider = true
    }

    let isConsumer = false
    if (props.peer.kind == "consumer") {
        isConsumer = true
    }


    const userHasValidSession = Boolean(session);

    let channelNotNull = "7"
    if (channel != null) {
        channelNotNull = channel
    }


    const notifyA = () => toast('W0w so easy !', { containerId: 'A' });
    const notifyB = () => toast('Wow so easy !', { containerId: 'B' });


    //const {theme} = useTheme()

    return (
        <LayoutAuthenticated>

            {/* ToastContainers */}
            <div>
                {/* https://fkhadra.github.io/react-toastify/introduction */}
                {/* One per each toast with a containerID to use */}
                <ToastContainer enableMultiContainer containerId={'A'} theme={"light"} draggable hideProgressBar={true} position={toast.POSITION.BOTTOM_LEFT} />
                <ToastContainer enableMultiContainer containerId={'B'} theme={"dark"} position={toast.POSITION.TOP_RIGHT} />
                <ToastContainer
                    enableMultiContainer
                    containerId={'PeerSavedNotification'}
                    theme={"dark"}
                    position={toast.POSITION.TOP_CENTER}
                />
                {/* Demonstrating the above ToastContainers     */}
                {/* <button onClick={notifyA}>Notify A !</button>
            <button onClick={notifyB}>Notify B !</button>   */}
            </div>


            {/* Design tool shows breakpoints on the rendered page */}
            {/* <div className="flex items-center m-2 fixed bottom-0 right-0 border border-gray-400 rounded p-2 bg-gray-300 text-pink-600 text-sm">
    Current breakpoint - 
    <span className="ml-1 sm:hidden md:hidden lg:hidden xl:hidden">default (&lt; 640px)</span>
    <span className="ml-1 hidden sm:inline md:hidden font-extrabold">sm</span>
    <span className="ml-1 hidden md:inline lg:hidden font-extrabold">md</span>
    <span className="ml-1 hidden lg:inline xl:hidden font-extrabold">lg</span>
    <span className="ml-1 hidden xl:inline 2xl:hidden font-extrabold">xl</span>
    <span className="ml-1 hidden 2xl:inline font-extrabold">2xl</span>
</div> */}



            {/* rows and columns w/ grid */}
            <div className="p-4"><Link href={"/"}><a className="inline-flex items-center rounded-sm border border-gray-light dark:border-gray-dark text-xs  px-3 py-2 text-gray dark:text-gray-light hover:bg-gray-lightestest dark:hover:bg-gray-dark focus:ring-1 focus:ring-blue mr-2" href="https://unconfigured.insecure.boring.surf/api/reboot"><IoArrowBack className="mr-2" /> peers </a></Link></div>


            <div className="p-8  xl:pt-0 grid overflow-hidden grid-cols-4 md:grid-cols-6 grid-rows-1 sm:gap-2">

                {/* {props.peer.provider_kind == "cloud" && (<li>provider_kind: {props.peer.provider_kind}</li>)} */}

                <div className="box row-start-1 col-span-4 md:col-span-6 col-start-2 md:col-start-1">

                    <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl pl-6 pt-2 mb-2">{name || ""}</h1>

                </div>

                <div className="box row-start-1 md:row-start-2 col-start-1 col-span-1 md:col-span-2">
                    <Avatar 
                        size="100%" 
                        name={peerAvatar} 
                        variant="sunset" 
                        colors={[
                            "#FB6900",
                            "#F63700",
                            "#004853",
                            "#007E80",
                            "#00B9BD"]} 
                    />
                </div>

                <div className=" box col-start-1 col-span-4 sm:col-span-4 ">

                    {isProvider && (
                        <div className="m-0 md:m-12">
                            <TrafficStats  {...props} />
                        </div>
                    )}
                    <form className="px-0 md:px-12" onSubmit={submitData}>

                        {/* Label / Friendly Name */}
                        <div className=" bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                            <label htmlFor="name" className="block text-xs text-gray ">
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

                        {isConsumer && (
                            <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2  focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                                <Listbox value={target} onChange={setTarget}>
                                    {({ open }) => (
                                        <>
                                            <Listbox.Label className="block text-xs text-gray "><IoServerOutline className="float-left mr-2" /> Select Provider</Listbox.Label>
                                            <div className="relative mt-1">

                                                <Listbox.Button className="relative w-full cursor-default rounded-sm border border-none dark:text-boring-white bg-boring-white dark:bg-boring-black py-6 pl-0 text-left  focus:border-blue focus:outline-none focus:ring-none  ">
                                                    <span className="text-boring-black dark:text-boring-white border-r border-gray-light dark:border-gray-dark pr-4 ">{target.country_code}</span>
                                                    <span className="float-left pr-3">
                                                        <Avatar
                                                            size="30"
                                                            name={peerAvatar}
                                                            variant="sunset"
                                                        />
                                                    </span>

                                                    <span className="pl-2 text-boring-black dark:text-boring-white text-sm">{target.name}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronUpDownIcon className="h-5 w-5 text-boring-black dark:text-boring-white" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>

                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {props.providerPeers.map((pp) => (
                                                            <Listbox.Option
                                                                key={pp.id}
                                                                value={pp}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'text-white bg-gray-lightest dark:bg-gray-dark' : 'text-gray-lightest',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                            >

                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={classNames(selected ? '' : '', 'block truncate')}>
                                                                            <span className="text-boring-black dark:text-boring-white border-r border-gray-light dark:border-gray-dark pr-4 text-xs">{pp.country_code}</span>

                                                                            <span className="float-left pr-3 ">
                                                                                <Avatar
                                                                                    size="16"
                                                                                    name={peerAvatar}
                                                                                    variant="sunset"
                                                                                />
                                                                            </span>

                                                                            <span className="pl-2 text-boring-black dark:text-boring-white text-sm">{pp.name}</span>
                                                                        </span>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'text-boring-white' : 'text-boring-white',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                )}
                                                                            >
                                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="mt-4 inline-flex items-center rounded-sm border border-gray dark:border-black text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2"
                        >
                            Save Changes
                        </button>
                        {/* If Provider is active or not yet, show relavant buttons */}

                        {isProvider && !providerActive && (

                            <button className="mt-4 inline-flex items-center rounded-sm border border-gray dark:border-black text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue" onClick={() => activatePeer(props.peer.id)}>Activate</button>

                        )}
                        <button className="mt-4 inline-flex items-center rounded-sm border border-gray dark:border-black text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue" onClick={() => shovePeerConfig(props.peer.id)}>Install Config</button>


                        {/* Advanced Configuration / Settings */}
                        <div className="mt-6 py-6 border-t border-b border-gray-lightest dark:border-gray-dark">
                            <h2 className="text-xs">Advanced / Helpers (Dev Mode):</h2>
                            <a className="mt-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-2 py-1 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2" href="https://unconfigured.insecure.boring.surf/api/reboot"><IoRefreshOutline className="mr-2" /> Reboot </a><a className="mt-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-2 py-1 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2" href="https://unconfigured.insecure.boring.surf/" target="_blank" rel="noreferrer"><IoBugOutline className="mr-2" /> Debug </a><a className="mt-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-2 py-1 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2" href="https://unconfigured.insecure.boring.surf:19531/browse" target="_blank" rel="noreferrer"> <IoFileTrayFull className="mr-2" /> Logs</a>
                            <button className="mt-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-2 py-1 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> boring.env</button>
                        </div>

                    </form>
                </div>

                <div className="box row-start-4 md:row-start-3 col-start-1 col-span-2 md:col-span-2 ">
                    {/* The small print. Details on the node */}
                    <div className="col-span-1  mt-12 text-gray">
                        <ul className="text-xs leading-relaxed">
                            <li key={props.peer.id}>Id: {props.peer.id}</li>
                            <li className="capitalize" key={props.peer.kind}>Kind: {props.peer.kind}</li>
                            <li key={props.peer.setupkey}>Boring Setupkey: {props.peer.setupkey}</li>
                            {/* Only show the pubkey if this is a provider node */}
                            {props.peer.kind == "provider" && (<li key={props.peer.pubkey}>Boring Pubkey: {props.peer.pubkey}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="md:p-12 box row-start-3 col-start-1 md:col-start-3 col-span-6 md:col-span-4">
                    <h2 className="text-gray text-sm mt-8 dark:border-gray-dark">Wifi Settings</h2>
                    {/* <p className="text-xs text-gray">hide me if this is a cloud provider</p> */}
                    <form onSubmit={submitData} className="max-w-xl">

                        {/* SSID */}
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <label htmlFor="name" className="block text-xs text-gray">
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

                        {/* WPA Passphrase */}
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <label htmlFor="name" className="block text-xs text-gray ">
                                <IoKey className="float-left mr-2" /> WPA Passphrase
                            </label>
                            <input
                                type="password"
                                name="wpa_passphrase"
                                id="wpa_passphrase"
                                onChange={(e) => setSelectedWPAPassphrase(e.target.value)}
                                className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white block w-full border-0 p-0 focus:ring-0 text-lg"
                                placeholder={props.peer.wpa_passphrase || ""}
                            />
                        </div>

                        {/* WiFi Mode */}

                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2  focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <Listbox value={wifi_preference} onChange={setSelectedWifiPreference}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-xs text-gray">Wifi Mode</Listbox.Label>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-sm border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 sm:text-sm">
                                                <span className="block truncate">{wifi_preference}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm text-gray dark:text-gray-lightest bg-boring-white dark:bg-boring-black py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {wifi_preferences.map((wp) => (
                                                        <Listbox.Option
                                                            key={wp}
                                                            value={wp}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-black dark:text-white bg-gray-lightest dark:bg-gray-dark' : 'text-gray-dark dark:text-gray-light',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                        >

                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                        {wp}
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-white' : 'text-indigo-600',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4 text-gray-dark dark:text-gray-lightest'
                                                                            )}
                                                                        >
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>

                        {/* WIFI CHANNEL */}

                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2  focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <Listbox value={channel} onChange={setChannel}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-xs text-gray">Channel</Listbox.Label>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-sm border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left  focus:outline-none focus:ring-0 sm:text-sm">
                                                <span className="block truncate">{channel}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm  text-gray dark:text-gray-lightest bg-boring-white dark:bg-boring-black py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {channels24.map((wp) => (
                                                        <Listbox.Option
                                                            key={wp}
                                                            value={wp}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-white dark:text-gray  bg-gray-lightest dark:bg-gray-dark' : '',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                        >

                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                        {wp}
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-white' : 'text-white',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                            )}
                                                                        >
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>


                        {/* <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <label className="block text-xs text-gray">WiFi Channel</label>
                            <select
                                onChange={(e) => setChannel(e.target.value)}
                                id="channel"
                                name="channel"
                                className="mt-1 block w-full rounded-sm border-gray-light py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none sm:text-sm"
                            >
                                <option key={channelNotNull + "channelidthing"} value={channelNotNull}>{channelNotNull + " selected"}</option>
                                {channels24.map(option => (
                                    <option key={option + "24channel"} value={option}>{option}</option>
                                ))}
                            </select>
                        </div> */}

                        {/* Country Code */}
                        <p className="pl-2 pt-4 text-gray text-xs">Please choose the country from which this peer will {isProvider && (<>provide</>)}{isConsumer && (<>consume</>)}</p>
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2  focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">

                            <Listbox value={country_code} onChange={setSelectedCountryCode}>

                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-xs text-gray "><IoMapOutline className="float-left mr-2" />Country</Listbox.Label>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-sm border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 sm:text-sm">
                                                <span className="block truncate">{country_code}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-boring-black" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm text-gray dark:text-gray-lightest bg-boring-white dark:bg-boring-black py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {CountryCodes.map((code) => (
                                                        <Listbox.Option
                                                            key={code.alpha2}
                                                            value={code.alpha2}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-black dark:text-white bg-gray-lightest dark:bg-gray-dark' : 'text-gray dark:text-gray-lightest',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                        >

                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                        {code.name}
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-white' : 'text-gray-light',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4 '
                                                                            )}
                                                                        >
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 inline-flex items-center rounded-sm border border-gray dark:border-black text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue mr-2"
                        >
                            Save Changes
                        </button>
                    </form>

                </div>

            </div>













            {/* Destroy Peer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 sm:px-14 pb-12">

                <div className="col-span-3  py-4 border rounded-sm border-gray-light dark:border-gray-dark">

                    <div className="text-boring-black dark:text-boring-white mt-6">
                        <div className="px-4 sm:p-6">
                            <h3 className="text-lg font-medium ">Destroy Peer</h3>
                            <div className="mt-2 max-w-xl text-xs ">
                                <p>Once you reset your peer, all data associated with it goes away, forever.</p>
                            </div>
                            <div className="mt-5">

                                <form>
                                    <button
                                        type="button"
                                        className="mt-6 flex justify-center rounded-sm border border-gray dark:border-black  text-boring-black dark:text-boring-white dark:bg-black py-2 px-2 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
                                        onClick={() => deletePeer(props.peer.id)}
                                    >
                                        Destroy
                                    </button>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>


            </div>


        </LayoutAuthenticated>
    );
};

export default ShowPeer;
