import React, { useEffect, useState } from "react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import Router, { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import prisma from "../lib/prisma"
import { PeerProps } from "../components/Peer"
import { IoAddOutline, IoRefreshOutline } from "react-icons/io5"
import { DiAndroid, DiApple, DiLinux, DiWindows } from "react-icons/di"
import { FaRaspberryPi } from "react-icons/fa"
import { SiIos } from "react-icons/si"
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import router from "next/router"
import WomanCanPhone from "../components/art/woman-can-phone"

const providerPlatformLists = ['local', 'cloud']
const providerPlatformDescriptions = ['For a machine such as a Raspberry Pi (Motherbored) that you have WiFi access with.', 'For a machine that is hosted in a cloud environment'];

const consumerPlatformLists = ['Motherbored', 'Linux', 'Mac', 'Windows', 'iOS', 'Android']

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

var generateName = require('boring-name-generator');

const customText = {
    'Motherbored': 'This is the currently supported option. A Raspberry Pi 4 is the recommended hardware.',
    'Linux': 'Advanced: Visit the #boredroom for Linux help.',
    'Mac': 'Advanced: Visit the #boredroom for Mac help.',
    'Windows': 'Advanced: Visit the #boredroom for Windows help.',
    'iOS': 'Advanced: Visit the #boredroom for iOS help.',
    'Android': 'Advanced: Visit the #boredroom for Android help.'
}

const icons = {
    'Motherbored': <FaRaspberryPi />,
    'Linux': <DiLinux />,
    'Mac': <DiApple />,
    'Windows': <DiWindows />,
    'iOS': <SiIos />,
    'Android': <DiAndroid />
}

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (!session || !session.user || !session.user.name) {
        res.statusCode = 403;
        return { props: { peers: [] } }
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

    const { query } = useRouter();
    const [queryMode, setQueryMode] = useState(query.mode || "consumer");
    const [queryConsumerPlatformMode, setQueryConsumerPlatformMode] = useState(query.consumer_platform || "pi");
    const [queryProviderPlatformMode, setQueryProviderPlatformMode] = useState(query.provider_platform || "local");

    useEffect(() => {
        if (queryMode === "consumer") {
            if (queryConsumerPlatformMode !== query.consumer_platform) {
                setQueryConsumerPlatformMode(query.consumer_platform || "motherbored");
            }
        } else if (queryMode === "provider") {
            if (queryProviderPlatformMode !== query.provider_platform) {
                setQueryProviderPlatformMode(query.provider_platform || "local");
            }
        }
    }, [query.mode, query.consumer_platform, query.provider_platform, queryConsumerPlatformMode, queryProviderPlatformMode]);

    useEffect(() => {
        if (queryMode === "consumer") {
            if (queryConsumerPlatformMode !== query.consumer_platform) {
                router.push({
                    pathname: router.pathname,
                    query: {
                        mode: queryMode,
                        consumer_platform: queryConsumerPlatformMode,
                    }
                });
            }
        } else if (queryMode === "provider") {
            if (queryProviderPlatformMode !== query.provider_platform) {
                router.push({
                    pathname: router.pathname,
                    query: {
                        mode: queryMode,
                        provider_platform: queryProviderPlatformMode
                    }
                });
            }
        }
    }, [queryMode, queryConsumerPlatformMode, queryProviderPlatformMode]);


    useEffect(() => {
        setSelectedConsumerPlatformLists(queryConsumerPlatformMode);
    }, [queryConsumerPlatformMode]);

    useEffect(() => {
        setSelectedProviderPlatformLists(queryProviderPlatformMode);
    }, [queryProviderPlatformMode]);

    const [name, setName] = useState<string>(generateName({ number: true }).dashed);
    const [wifi_preference, setWifiPreference] = useState<string>("2.4Ghz");
    const [channel, setChannel] = useState<string>("7");
    const [ssid, setSSID] = useState<string>("boring");
    const [wpa_passphrase, setWpaPassphrase] = useState<string>('motherbored');
    const [country_code, setCountryCode] = useState<string>("US");
    const [target, setTarget] = useState<string>(props.peers[0].id);
    const [kind, setKind] = useState(queryMode);
    const [consumer_platform, setConsumerPlatform] = useState(queryConsumerPlatformMode);
    const [provider_platform, setProviderPlatform] = useState(queryProviderPlatformMode);

    const [selectedConsumerPlatformLists, setSelectedConsumerPlatformLists] = useState(queryConsumerPlatformMode)
    const [selectedProviderPlatformLists, setSelectedProviderPlatformLists] = useState(queryProviderPlatformMode)

    function handleChangeRadioGroup(newKind: string, newProviderPlatform: string, newConsumerPlatform: string) {
        if (newKind == "consumer") {
            setTarget(props.peers[0].id);
        }
        setKind(newKind);
        setProviderPlatform(newProviderPlatform);
        setConsumerPlatform(newConsumerPlatform);
    }

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = {
                name: name,
                kind: kind,
                target: target,
                provider_platform: selectedProviderPlatformLists,
                consumer_platform: selectedConsumerPlatformLists,
                wifi_preference: wifi_preference,
                channel: channel,
                ssid: ssid,
                wpa_passphrase: wpa_passphrase,
                country_code: country_code
            };
            const response = await fetch("/api/peer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const resultData = await (response.json()) as any;
            if (response.ok) {
                await Router.replace(`/p/${resultData.id}`);
            } else {
                await Router.replace("/")
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <LayoutAuthenticated>
            <div className="container mx-auto relative">

                <WomanCanPhone />

                <div className="absolute top-0 w-3/4 lg:w-1/2">
                    <form className="drop-shadow-xl p-12 " onSubmit={submitData}>
                        <h1 className="uppercase mb-6">New <span>{query.mode}</span> Peer</h1>
                        <p className="text-xs"></p>
                        <div className="d-flex">
                            <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue flex-1">
                                <label htmlFor="name" className="block text-xs text-gray">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white block w-full border-0 p-0 focus:ring-0 text-lg"
                                    placeholder=""
                                    value={name}
                                    disabled
                                />
                            </div>
                            <div className="ml-2">
                                <a onClick={(e) => setName(generateName({ number: true }).dashed)}>
                                    <span className="cursor-pointer float-right px-4 py-4 border border-gray-light dark:border-gray-dark my-4 rounded-sm hover:text-gray active:text-gray-dark bg-boring-white dark:bg-boring-black">
                                        <IoRefreshOutline />
                                    </span>
                                </a>
                            </div>
                        </div>


                        <div className="mt-12 mb-8">
                            {queryMode === "consumer" && (
                                <div className="">
                                    <select
                                        id="conusmer"
                                        value={queryConsumerPlatformMode}
                                        onChange={(e) => setQueryConsumerPlatformMode(e.target.value)}
                                        className="cursor-pointer mt-1 block w-full rounded-sm bg-boring-white dark:bg-boring-black border-gray-light dark:border-gray-dark py-3 pl-3 pr-10 text-sm focus:border-blue focus:outline-none focus:ring-indigo-500"
                                    >

                                        {consumerPlatformLists.map((consumerPlatformList) => (
                                            <option
                                                key={consumerPlatformList}
                                                value={consumerPlatformList}
                                                onClick={() => handleChangeRadioGroup(kind, provider_platform, consumer_platform)}
                                            >
                                                {consumerPlatformList}

                                            </option>
                                        ))}
                                    </select>

                                    <p className="pl-2 text-xs text-gray dark:text-gray-light py-3 align-middle">
                                        <span className="icon float-left mr-2">{icons[selectedConsumerPlatformLists]}</span>
                                        {customText[selectedConsumerPlatformLists]}
                                    </p>
                                </div>
                            )}

                            {queryMode === "provider" && (
                                <div className="">
                                    <RadioGroup id="provider" value={queryProviderPlatformMode} onChange={(e) => setQueryProviderPlatformMode(e.target.value)}>
                                        <RadioGroup.Label className="text-xs font-medium text-gray">Where will you be running your node?</RadioGroup.Label>

                                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                            {providerPlatformLists.map((providerPlatformList, index) => (

                                                <RadioGroup.Option
                                                    key={providerPlatformList}
                                                    value={providerPlatformList}
                                                    onChange={(e) => setQueryProviderPlatformMode(e.target.value)}
                                                    className={({ checked, active }) =>
                                                        classNames(
                                                            'relative flex cursor-pointer rounded-lg border border-gray-light bg-white p-4 shadow-sm focus:outline-none',
                                                            checked ? 'border-transparent' : '',
                                                            active ? 'border-gray-light bg-white' : '',
                                                            'dark:border-gray-dark dark:bg-gray-dark'
                                                        )
                                                    }
                                                >
                                                    {({ checked, active }) => (
                                                        <>
                                                            <span className="flex flex-1">
                                                                <span className="flex flex-col">
                                                                    <RadioGroup.Label as="span" className="mb-2 block text-sm text-gray-dark dark:text-gray-light">
                                                                        {providerPlatformList}
                                                                    </RadioGroup.Label>
                                                                    <RadioGroup.Description as="span" className="mt-1 flex items-center text-xs text-gray-dark dark:text-gray-light">
                                                                        {providerPlatformDescriptions[index]}
                                                                    </RadioGroup.Description>
                                                                </span>
                                                            </span>
                                                            <CheckCircleIcon
                                                                className={classNames(!checked ? 'invisible' : '', 'h-5 w-5 text-gray-dark')}
                                                                aria-hidden="true"
                                                            />
                                                            <span
                                                                className={classNames(
                                                                    active ? 'border' : 'border-1',
                                                                    checked ? 'border-blue' : 'border-gray-dark',
                                                                    'pointer-events-none absolute -inset-px rounded-lg',
                                                                    'dark:border-gray-light dark:bg-gray-dark'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}
                        </div>
                        <div className="hidden">
                            <input name="kind" value={query.mode}></input>
                            <input name="ssid" value="boring"></input>
                            <input name="wpa_passphrase" value="motherbored"></input>
                            <input name="country_code" value="US"></input>
                            <input name="channel" value="7"></input>
                            <input name="wifi_preference" value="2.4Ghz" ></input>
                        </div>
                        <button className="cursor-pointer my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-4 py-3 text-boring-black dark:text-gray-light hover:bg-boring-white hover:border-white hover:opacity-90 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm" type="submit" value="Create Peer" ><IoAddOutline className="mr-2" /> Create Peer</button>
                    </form>
                </div>
            </div>
        </LayoutAuthenticated >
    );
};

export { getServerSideProps }

export default NewPeer;
