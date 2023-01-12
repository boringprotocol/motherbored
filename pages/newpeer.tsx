// TODO:
// SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
// i think the falcon.ts is not returning the correct data
// boring.dank.earth is returing html error page, not json
// maybe the endpoint is down or wrong url
//
// i need to hook up the loading indicator and prevent retards from spamming the create button
// when the create button is clicked, it should disable the button and show a loading indicator

import React, { useState } from "react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import Router, { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import prisma from "../lib/prisma"
import Peer, { PeerProps } from "../components/Peer"
import { IoRefreshOutline } from "react-icons/io5"

// radio buttons to select provider_kind
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

const providerKindLists = ['local', 'cloud']
/* { id: 1, title: 'Local', description: 'Usually a device you own, like a Motherbored' },
 { id: 2, title: 'Cloud', description: 'On a server somewhere, probably remote' },
]
*/

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

// https://github.com/boringprotocol/boring-name-generator/
var generateName = require('boring-name-generator');

//
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

//
type Props = {
    peers: PeerProps[]
}

const NewPeer: React.FC<Props> = (props) => {

    const { query } = useRouter();


    const [name, setName] = useState(generateName({ number: true }).dashed);

    let queryMode = "consumer"
    if (query.mode) { queryMode = String(query.mode) }

    let queryProviderMode = "local"
    if (query.provider_kind) { queryProviderMode = String(query.provider_kind) }
    const [selectedProviderKindLists, setSelectedProviderKindLists] = useState(queryProviderMode)
    const [kind, setKind] = useState(queryMode);
    const [wifi_preference, setWifiPreference] = useState("2.4Ghz");
    const [channel, setChannel] = useState("7");
    const [ssid, setSSID] = useState("boring");
    const [wpa_passphrase, setWpaPassphrase] = useState('motherbored');
    const [country_code, setCountryCode] = useState("US");
    const [target, setTarget] = useState(props.peers[0].id);

    function handleChangeKind(newKind: string) {
        if (newKind == "consumer") {
            setTarget(props.peers[0].id);
        }
        setKind(newKind);
    }


    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { name: name, kind: kind, target: target, provider_kind: selectedProviderKindLists, wifi_preference: wifi_preference, channel: channel, ssid: ssid, wpa_passphrase: wpa_passphrase, country_code: country_code };
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
            <div className="px-4 sm:px-8 md:px-12 pt-16">


                <form className="w-100 md:w-1/2" onSubmit={submitData}>
                    <h1 className="uppercase mb-6">New <span>{query.mode}</span> Peer</h1>
                    <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                        <label htmlFor="name" className="block text-xs text-gray">
                            Peer Name
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
                    <div className="mt-4 ">
                        <a onClick={(e) => setName(generateName({ number: true }).dashed)}><span className="float-right p-4 border border-gray-lightest rounded-sm hover:text-gray active:text-gray-dark"><IoRefreshOutline /></span></a>
                    </div>


                    {kind == "provider" && (
                        <div className="">

                            <RadioGroup value={selectedProviderKindLists} onChange={setSelectedProviderKindLists}>
                                <RadioGroup.Label className="text-xs font-medium text-gray">Select a Provider Kind</RadioGroup.Label>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {providerKindLists.map((providerKindList) => (
                                        <RadioGroup.Option
                                            key={providerKindList}
                                            value={providerKindList}
                                            //defaultValue={query.provider_kind}
                                            className={({ checked, active }) =>
                                                classNames(
                                                    checked ? 'border-transparent' : 'border-gray-300',
                                                    active ? 'dark:border-gray-dark ring-2 ring-blue' : '',
                                                    'relative flex cursor-pointer rounded-lg border bg-boring-black p-4 shadow-sm focus:outline-none'
                                                )
                                            }
                                        >
                                            {({ checked, active }) => (
                                                <>
                                                    <span className="flex flex-1">
                                                        <span className="flex flex-col">
                                                            <RadioGroup.Label as="span" className="mb-2 block text-xs font-medium text-gray-900">
                                                                {providerKindList}
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description as="span" className="mt-1 flex items-center text-xs text-gray">
                                                                {providerKindList}
                                                            </RadioGroup.Description>
                                                        </span>
                                                    </span>
                                                    <CheckCircleIcon
                                                        className={classNames(!checked ? 'invisible' : '', 'h-5 w-5 text-indigo-600')}
                                                        aria-hidden="true"
                                                    />
                                                    <span
                                                        className={classNames(
                                                            active ? 'border' : 'border-2',
                                                            checked ? 'border-indigo-500' : 'border-gray-dark',
                                                            'pointer-events-none absolute -inset-px rounded-lg'
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


                    {/* hide me and give me default values. we should set defaults another way obviously */}
                    <div className="hidden">
                        <input name="kind" value={query.mode}></input>
                        <input name="ssid" value="boring"></input>
                        <input name="wpa_passphrase" value="motherbored"></input>

                        {/* state setters for these */}
                        <input name="country_code" value="US"></input>
                        <input name="channel" value="7"></input>
                        <input name="wifi_preference" value="2.4Ghz" ></input>

                    </div>

                    <input className="float-left  mt-6 flex justify-center rounded-sm border border-transparent  py-2 px-4 text-sm text-gray shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40" type="submit" value="Create" />

                    <a className="back" onClick={() => Router.push("/")}>
                        <span className="text-xs float-left ml-6 mt-8">or Cancel</span>
                    </a>
                </form>
            </div>
        </LayoutAuthenticated >
    );
};

//
export { getServerSideProps }

//
export default NewPeer;
