import React, { useState, Fragment, useEffect } from "react"
import { GetServerSideProps } from "next"
import Router from "next/router"
import { PeerProps } from "../../components/Peer"
import LayoutAuthenticated from "../../components/layoutAuthenticated"
import prisma from "../../lib/prisma"
import { useSession, getSession } from "next-auth/react"
import { IoKey, IoDownloadOutline, IoWifiOutline, IoFileTrayFull, IoBugOutline, IoRefreshOutline, IoPricetagOutline } from "react-icons/io5"
import { toast } from 'react-toastify'
import Toast from '../../components/Toast';
import CountryCodes from "../../data/country_codes"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { GetStatsForPubkey, GetPeersForPubkey } from "../../lib/influx"
import DestroyProviderPeer from "../../components/DestroyProviderPeer"
import { useQRCode } from 'next-qrcode';
import useColorQR from "../../helpers/useColorQR"

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

    return {
        props: { peer: peer, providerPeers: providerPeers },
    };


};

type Props = {
    peer: PeerProps,
    target: PeerProps,
    providerPeers: PeerProps[],
}

// Activate Peer
async function activatePeer(id: string): Promise<void> {
    const result = await fetch(`/api/activate/${id}`, {
        method: "PUT",
    });
    if (result.ok) {
        toast.success('Great news. Successfully activated!')
    } else {
        toast.error('Activation failed')
    }
    //await Router.push(`/p/${id}`);
}

// Download config file boring.env 
async function downloadPeerConfig(id: string): Promise<void> {
    //await fetch(`/api/config/${id}`, {
    //    method: "GET",
    //});
    await Router.push(`/api/config/${id}`);
}

// Send config file boring.env to motherbored
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

                toast.success('We did it! boring.network is configured, rebooting')
            } else {
                // notify("something went wrong trying to configure boring.network")
                toast.error('something went wrong trying to configure boring.network')
            }
        } catch {
            // notify("ERROR: dns resolution for boring.surf failed")
            toast.error(<>
                <div className="">
                    <p>ERROR: DNS resolution for boring.surf failed, are you <em>sure</em> you are connected to your device WiFi?</p>
                </div>
            </>)
        }
    } else {
        //notify("ERROR: results were NOT OK")
        toast.error('ERROR: results were NOT OK')
    }
}

const ShowPeer: React.FC<Props> = (props) => {

    const { primaryColor, bgColor } = useColorQR();
    const { Canvas } = useQRCode();
    const [name] = useState(props.peer.name);
    const [label, setLabel] = useState(props.peer.label);
    const [ssid, setSSID] = useState(props.peer.ssid);
    const [country_code, setSelectedCountryCode] = useState(props.peer.country_code || '');
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

            // New Config Saved
            if (response.ok) {
                toast.success(
                    <div className="prose text-sm">
                        <strong>💃 Success!</strong> {props.peer.country_code} Install Config to activate <p><a href={`/a/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="btn btn-outline" onClick={() => shovePeerConfig(props.peer.id)}>Install Config</button>
                        </a></p>
                    </div>
                )
            }


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


    const submitDataEditLabel = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { id: id, name: name, label: label, ssid: ssid, country_code: country_code, wifi_preference: wifi_preference, wpa_passphrase: wpa_passphrase, target: target.id, channel: channel };
            const response = await fetch(`/api/peer/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            //Peer Saved
            if (response.ok) {
                toast.success(
                    <><p>Label changed to {props.peer.label}. No need to install a new configuration.</p></>
                )
            }

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

    let channelNotNull = "7"
    if (channel != null) {
        channelNotNull = channel
    }



    return (
        <LayoutAuthenticated>
            <div>
                <Toast />

                {isProvider && !providerActive && (
                    <>
                        <div className="p-8">
                            <div className="alert shadow-lg">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-base-content flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <div>
                                        <h3 className="font-bold">Peer Activation</h3>
                                        <div className="text-xs">This peer is not avtivated on the network yet. You must be connected to "{props.peer.ssid}" Wifi </div>
                                    </div>
                                </div>
                                <div className="flex-none">
                                    <button className="btn btn-sm btn-outline" onClick={() => activatePeer(props.peer.id)}>Activate</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="p-8 xl:pt-0 grid overflow-hidden grid-cols-4 md:grid-cols-6 grid-rows-1 sm:gap-2">

                    {/* Name */}
                    <div className="row-start-1 col-span-4 md:col-span-6 col-start-2 md:col-start-1 py-8">
                        <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl">{name || ""}</h1>
                    </div>

                    <div className="card row-start-1 md:row-start-2 col-start-1 col-span-1 md:col-span-2">

                        {/* QR   */}
                        <div className="bg-base-100 card card-bordered">
                            <div className="">
                                <Canvas
                                    text={'https://phantom.app/ul/motherbored.app'}
                                    options={{
                                        level: 'H',
                                        margin: 0,
                                        width: 250,
                                        color: {
                                            dark: primaryColor,
                                            light: 'ffffff00',
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        {/* Install Config / The small print. Details on the node */}
                        <div className="mt-4 prose box row-start-4 md:row-start-3 col-start-1 col-span-2 md:col-span-2">
                            <button className="btn btn-outline" onClick={() => shovePeerConfig(props.peer.id)}>Install Config</button>
                            <div className="col-span-1 mt-12 text-gray">
                                <ul className="text-xs leading-relaxed list-none p-0">
                                    <li key={props.peer.id}>Id: {props.peer.id}</li>
                                    <li className="capitalize" key={props.peer.kind}>Kind: {props.peer.kind}</li>
                                    <li key={props.peer.setupkey}>Boring Setupkey: {props.peer.setupkey}</li>
                                    {/* Only show the pubkey if this is a provider node */}
                                    {props.peer.kind == "provider" && (<li key={props.peer.pubkey}>Boring Pubkey: {props.peer.pubkey}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Advanced Configuration / Settings */}
                        <div className="mt-6 py-6">
                            <h2 className="text-xs">Advanced / Helpers (Dev Mode):</h2>
                            <a className="btn btn-xs btn-info inline-flex items-center mr-2" href="https://unconfigured.insecure.boring.surf/api/reboot"><IoRefreshOutline className="mr-2" /> Reboot </a><a className="btn btn-xs btn-info inline-flex items-center mr-2" href="https://unconfigured.insecure.boring.surf/" target="_blank" rel="noreferrer"><IoBugOutline className="mr-2" /> Debug </a><a className="btn btn-xs btn-info inline-flex items-center mr-2" href="https://unconfigured.insecure.boring.surf:19531/browse" target="_blank" rel="noreferrer"> <IoFileTrayFull className="mr-2" /> Logs</a>
                            <button className="btn btn-xs btn-info inline-flex items-center mr-2" onClick={() => downloadPeerConfig(props.peer.id)}><IoDownloadOutline className="mr-2" /> boring.env</button>
                        </div>

                    </div>

                    {/* Main */}
                    <div className="card card-bordered col-start-1 col-span-4 sm:col-span-4 p-4 shadow-sm">

                        <form className="form" onSubmit={submitDataEditLabel}>
                            <div className="form-control">
                                <label htmlFor="name" className="label text-xs">
                                    Label
                                    <IoPricetagOutline className="float-right" />
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="label"
                                        id="label"
                                        onChange={(e) => setLabel(e.target.value)}
                                        className="input input-bordered w-full max-w-100"
                                        placeholder={label || ""}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-square btn-outline">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Wifi Settings */}
                        <div className="card card-bordered mt-12 p-4">
                            <h2 className="text-sm">Wifi Settings</h2>
                            {/* <p className="text-xs text-gray">hide me if this is a cloud provider</p> */}
                            <form onSubmit={submitData} className="max-w-xl">
                                {/* SSID */}
                                <div className="form-control mt-2">
                                    <label htmlFor="name" className="label text-xs">
                                        <IoWifiOutline className="float-left" /> SSID
                                    </label>
                                    <input
                                        type="text"
                                        name="ssid"
                                        id="ssid"
                                        onChange={(e) => setSSID(e.target.value)}
                                        className="input input-bordered"
                                        placeholder={ssid || ""}
                                    />
                                </div>
                                {/* WPA Passphrase */}
                                <div className="form-control mt-2">
                                    <label htmlFor="name" className="label text-xs">
                                        <IoKey className="float-left mr-2" /> WPA Passphrase
                                    </label>
                                    <input
                                        type="password"
                                        name="wpa_passphrase"
                                        id="wpa_passphrase"
                                        onChange={(e) => setSelectedWPAPassphrase(e.target.value)}
                                        className="input input-bordered"
                                        placeholder={props.peer.wpa_passphrase || ""}
                                    />
                                </div>
                                {/* WiFi Mode */}
                                <div className="">
                                    <Listbox value={wifi_preference} onChange={setSelectedWifiPreference}>
                                        {({ open }) => (
                                            <>
                                                <Listbox.Label className="block text-xs text-gray-500">Wifi Mode</Listbox.Label>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="relative w-full cursor-default rounded border-none bg-white text-black dark:bg-dark dark:text-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 sm:text-sm">
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
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-dark py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {wifi_preferences.map((wp) => (
                                                                <Listbox.Option
                                                                    key={wp}
                                                                    value={wp}
                                                                    className={({ active }) =>
                                                                        classNames(
                                                                            active ? 'text-black dark:text-white bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300',
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
                                                                                        active ? 'text-white' : 'text-primary-500',
                                                                                        'absolute inset-y-0 right-0 flex items-center pr-4 text-gray-700 dark:text-gray-300'
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
                                <div className="h-20">
                                    <Listbox value={channel} onChange={setChannel}>
                                        {({ open }) => (
                                            <>
                                                <Listbox.Label className="block text-xs text-gray-500">Channel</Listbox.Label>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="btn btn-outline btn-sm w-full cursor-default">
                                                        <span className="truncate">{channel}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 right-0" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.707 12.293a1 1 0 01-1.414 0L6.586 8.879a1 1 0 011.414-1.414L10 10.086l2.293-2.293a1 1 0 011.414 1.414l-3 3z" clipRule="evenodd" />
                                                        </svg>
                                                    </Listbox.Button>

                                                    <Listbox.Options className="menu dropdown-content absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-base-100">
                                                        {channels24.map((wp) => (
                                                            <Listbox.Option
                                                                key={wp}
                                                                value={wp}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'dropdown-item  bg-base-100 text-base-content' : '',
                                                                        'text-sm'
                                                                    )
                                                                }
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                                                                            {wp}
                                                                        </span>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'text-base-content' : 'text-base-content',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                )}
                                                                            >
                                                                                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                                {/* Country Code */}
                                <label className="block ">Country Code</label>
                                <select className="select select-md" value={country_code} onChange={(e) => setSelectedCountryCode(e.target.value)}>
                                    {CountryCodes.map((code) => (
                                        <option key={code.alpha2} value={code.alpha2}>
                                            {code.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-outline"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

                <DestroyProviderPeer peerId={props.peer.id} />

            </div>
        </LayoutAuthenticated>
    );
};

export default ShowPeer;
