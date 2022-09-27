import React, { useState, Fragment } from "react"
import { GetServerSideProps } from "next"
import Router from "next/router"
import Peer, { PeerProps } from "../../components/Peer"
import LayoutAuthenticated from "../../components/layoutAuthenticated"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import { IoMapOutline, IoKey, IoDownloadOutline, IoWifiOutline, IoCloudUploadOutline, IoServerOutline } from "react-icons/io5"
import Image from 'next/image'
// import { toNamespacedPath } from "path"
import toast, { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CountryCodes from "../../data/country_codes"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import Avatar from "boring-avatars";


  

const dudify = () => toast("Wow so easy!");


const steps = [
    { id: '01', name: 'Provider Peer Creation', description: 'Please configure your peer next.', href: '#', status: 'complete' },
    { id: '02', name: 'Configure', description: 'Installing config.', href: '#', status: 'current' },
    { id: '03', name: 'Activation', description: 'All set.', href: '#', status: 'upcoming' },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

// Success: Node created, Node deleted, node modified, activated(provider), /configured
// Error: timeout, form contents are gross don't type that way... that name already exists / conflicts 

// Toast stuff - later move to a file of its own
const notify = (message: string) =>
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-boring-white dark:bg-boring-black shadow-lg border border-gray-lightest dark:border-gray-dark rounded-sm pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">

                        <img
                            className="h-16 w-16 rounded-full"
                            src="/img/cathy.png"
                            alt=""
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-boring-black dark:text-boring-white">
                            {message}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {/* Sure! 8:30pm works great! */}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border-l dark:border-gray-dark border-gray-lightest rounded-none rounded-r-sm p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    const providerPeers = await prisma.peer.findMany({
        where: { kind: "provider", pubkey: { not: null } },
    })

    if (targetPeer == null || targetPeer.name == null) {
        return { props: { peer: peer, target: "" } }
    }

    return {
        props: { peer: peer, target: targetPeer.name, providerPeers: providerPeers },
    };
};

type Props = {
    peer: PeerProps,
    target: string,
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
        toast.success("Success! That peer has been wiped from existance.");
    } else {
        notify("Oh no! We couldn't delete this peer. Try again.");
    }
    await Router.push(`/`);
}

// Activate peer
async function activatePeer(id: string): Promise<void> {
    const result = await fetch(`/api/activate/${id}`, {
        method: "PUT",
    });
    if (result.ok) {
        toast.success("Great news. Successfully activated!");
    } else {
        notify("Your funds have been drained idiot!");
    }
    await Router.push(`/p/${id}`);
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
    notify("We're attempting to configure your Motherbored. Please wait 30 seconds or so...")
    if (results.ok) {
        const text = await results.text();
        const sendItURI = "https://unconfigured.insecure.boring.surf/api/hello?falconconfig=" + encodeURIComponent(text);
        try {
            const sendIt = await fetch(sendItURI, {
                method: "GET",
                mode: "no-cors",
            });
            if (sendIt.status == 200) {
                notify("We did it! boring.network is configured, please reboot")
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

    // generating peer avatoar from the id as opposed to the label
    const peerAvatar = props.peer.id

    // here dude - update components/Peer.tsx to make mroe of these babies
    const [name, setName] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const [country_code, setSelectedCountryCode] = useState(props.peer.country_code)
    const [wifi_preference, setSelectedWifiPreference] = useState(props.peer.wifi_preference)
    const [wpa_passphrase, setSelectedWPAPassphrase] = useState(props.peer.wpa_passphrase)
    const [target, setTarget] = useState(props.peer.target);
    const [channel, setChannel] = useState(props.peer.channel);
    const id = props.peer.id;

    const wifi_preferences = ["2.4Ghz", "5Ghz"]
    const channels24 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { id: id, name: name, label: label, ssid: ssid, country_code: country_code, wifi_preference: wifi_preference, wpa_passphrase: wpa_passphrase, target: target, channel: channel };
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

    if (!session) {
        Router.push("/")
        return <div>Your funds have been drained lmao</div>;
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

    //setName (props.peer.name)

    return (
        <LayoutAuthenticated>

            <div>
                <Toaster position="top-left" />
            </div>

         
            
            



            {/* The Current Peer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 sm:px-14 py-12 border-b border-gray-light dark:border-gray-dark">

                {/* Boring Generated Name */}
                <div className="col-span-3"><h1 className="text-2xl sm:text-6xl md:text-7xl pb-12 sm:pt-4">{name || ""}</h1></div>

                <div className="">


                
        <div className="">
        <Avatar
          size="100%"
          name={peerAvatar}
          variant="sunset"
        />
        </div>
        

                    {/* {props.peer.kind == "provider" && (<p className="text-xs" >this is a provider node</p>)} */}

                    {/* The small print. Details on the node */}
                    <div className="col-span-3 mt-12 text-gray">
       
                        <ul className="text-xs leading-relaxed">
                            <li key={props.peer.id}>Id: {props.peer.id}</li>
                            <li className="capitalize" key={props.peer.kind}>Kind: {props.peer.kind}</li>
                            <li key={props.peer.setupkey}>Boring Setupkey: {props.peer.setupkey}</li>
                            {/* Only show the pubkey if this is a provider node */}
                            {props.peer.kind == "provider" && (<li key={props.peer.pubkey}>Boring Pubkey: {props.peer.pubkey}</li>)}
                        </ul>
                    </div>

                           {/* Advanced Configuration / Settings */}
                <div className="col-span-3 mt-6"> 
                    <button className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> boring.env</button>
                </div>
                   
                   
                   <div className="py-6">
                    {isProvider && !providerActive && (
                            <div>
                                <button className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => shovePeerConfig(props.peer.id)}><IoCloudUploadOutline className="mr-2" /> install config</button>
                                <button className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => activatePeer(props.peer.id)}><IoDownloadOutline className="mr-2" /> Activate</button>
                            </div>
                        )}
                            {!isProvider && (
                                <button className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={() => shovePeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> install config</button>
                    )} 
                    </div>


                </div>

                <div className="px-12 col-span-1 sm:col-span-2">

                    {/* Main Form */}
                    <form className="w-full pb-24 mb-12 border-b border-gray-lightestest dark:border-gray-dark" onSubmit={submitData}>

                        {/* Label / Friendly Name */}
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
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

                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <Listbox value={target} onChange={setTarget}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-xs text-gray "><IoServerOutline className="float-left mr-2"/> Change Provider</Listbox.Label>
                                        <div className="relative mt-1">

                                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-none dark:text-boring-white bg-boring-white dark:bg-boring-black py-4 pl-2 pr-10 text-left shadow-sm focus:border-blue focus:outline-none focus:ring-none  sm:text-sm">
                                                <span className="block truncate text-gray-lightest">{country_code} - {name} - {label}</span>
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
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-boring-black text-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {props.providerPeers.map((pp) => (
                                                        <Listbox.Option
                                                            key={pp.id}
                                                            value={pp.id}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-white bg-gray-dark' : 'text-gray-lightest',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                        >

                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    <span className="text-gray">{pp.country_code}</span> - {pp.name}
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-green' : 'text-green',
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
                            className="mt-4 inline-flex items-center rounded-sm border border-transparent text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue"
                        >
                            Save Changes
                        </button>
                        
                    </form>

                    

                    {/* Wifi Form */}
                    <h2 className="pb-6 text-gray text-sm ">Wifi Settings</h2>
                    <form>

                        {/* SSID */}
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
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
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
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

                        {/* Country Code */}
                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">

                            <Listbox value={country_code} onChange={setSelectedCountryCode}>

                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-xs text-gray "><IoMapOutline className="float-left mr-2" />Country</Listbox.Label>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-0 sm:text-sm">
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
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md text-black bg-boring-white dark:bg-boring-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {CountryCodes.map((code) => (
                                                        <Listbox.Option
                                                            key={code.alpha2}
                                                            value={code.alpha2}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-black dark:text-white bg-gray-lightest dark:bg-gray-dark' : 'text-gray-dark',
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


                        {/* WiFi Mode */}

                        <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-md px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
                            <Listbox value={wifi_preference} onChange={setSelectedWifiPreference}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-sm font-medium text-gray-700">Wifi Mode</Listbox.Label>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
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
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {wifi_preferences.map((wp) => (
                                                        <Listbox.Option
                                                            key={wp}
                                                            value={wp}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-white bg-black' : 'text-gray',
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

                        {/* WIFI CHANNEL */}
                        <div>
                            <label>WiFi Channel</label>
                            <select
                                onChange={(e) => setChannel(e.target.value)}
                                id="channel"
                                name="channel"
                                className="mt-1 block w-full rounded-md border-gray-light py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option key={channelNotNull + "channelidthing"} value={channelNotNull}>{channelNotNull + " selected"}</option>
                                {channels24.map(option => (
                                    <option key={option + "24channel"} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 inline-flex items-center rounded-sm border border-transparent text-sm bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white focus:ring-1 focus:ring-blue"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>

                

         
                



                    


                

                    <div className="col-span-3  py-16 border-b border-gray-light dark:border-gray-dark">

                        <div className="text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black border border-gray-dark shadow sm:rounded-lg mt-6">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium ">Destroy Peer</h3>
                                <div className="mt-2 max-w-xl text-xs ">
                                    <p>Once you reset your peer, all data associated with it goes away, forever.</p>
                                </div>
                                <div className="mt-5">
                               
                                    
                                    <form>
                                        <button
                                            type="button"
                                            className="mt-6 flex justify-center rounded-sm border text-boring-black dark:text-boring-white border-boring-black dark:border-boring-white  py-2 px-2 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
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
