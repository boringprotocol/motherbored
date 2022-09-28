import React, { useState } from "react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import Router, { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import prisma from "../lib/prisma"
import Peer, { PeerProps } from "../components/Peer"
import { IoRefreshOutline } from "react-icons/io5"


// radio buttons to elect provider_mode
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'


const providerKindLists = [
    { id: 1, title: 'Local', description: 'Usually a device you own, like a Motherbored' },
    { id: 2, title: 'Cloud', description: 'On a server somewhere, probably remote' },
]


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
    const [kind, setKind] = useState(queryMode);
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

    const [selectedProviderKindLists, setSelectedProviderKindLists] = useState(providerKindLists[0])

    return (
        <LayoutAuthenticated>
            <div className="px-4 sm:px-8 md:px-12 pt-16">




                <p>{query.provider_kind}</p>

                <form className="w-100 md:w-1/2" onSubmit={submitData}>
                    <h1 className="uppercase mb-6">New <span>{query.mode}</span> Peer</h1>
                    <div className="border border-gray-dark text-boring-white rounded-sm px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
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
                        <a onClick={(e) => setName(generateName({ number: true }).dashed)}><span className=""><IoRefreshOutline /></span></a>
                    </div>
                    <div className="my-6 border border-gray-dark text-boring-white rounded-sm px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                        <label htmlFor="mode" className="block text-xs text-gray">
                            Mode
                        </label>
                        <select
                            onChange={(e) => handleChangeKind(e.target.value)}
                            id="kind"
                            name="kind"
                            className="bg-boring-black block w-full border-0 p-0 text-gray-lightest placeholder-boring-white focus:ring-0 text-lg"
                            defaultValue={query.mode}
                        >
                            <option key="consumer" value="consumer">Consumer</option>
                            <option key="provider" value="provider">Provider</option>
                            required
                        </select>
                    </div>
                    {/* // Spawn provider menu     */}
                    {kind == "consumer" && (
                        <div className="border border-gray-dark text-boring-white rounded-sm px-3 py-2 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
                            {/* https://tailwindui.com/components/application-ui/forms/select-menus#component-71d9116be789a254c260369f03472985 */}
                            <label htmlFor="target" className="block text-xs text-gray">
                                Select an available vpn provider:
                            </label>
                            <select
                                onChange={(e) => setTarget(e.target.value)}
                                id="target"
                                name="target"
                                className="bg-boring-black block w-full border-0 p-0 text-gray-lightest placeholder-boring-white focus:ring-0 text-lg"
                            >
                                {props.peers.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {kind == "provider" && (
                        <div className="">

                            <RadioGroup value={selectedProviderKindLists} onChange={setSelectedProviderKindLists}>
                                <RadioGroup.Label className="text-xs font-medium text-gray">Select a Provider Kind</RadioGroup.Label>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {providerKindLists.map((providerKindList) => (
                                        <RadioGroup.Option
                                            key={providerKindList.id}
                                            value={providerKindList}
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
                                                                {providerKindList.title}
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description as="span" className="mt-1 flex items-center text-xs text-gray">
                                                                {providerKindList.description}
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
