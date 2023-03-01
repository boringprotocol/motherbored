import { Listbox } from "@headlessui/react";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import ChevronUpDownIcon from "@heroicons/react/24/outline/ChevronUpDownIcon";
import { IoKey, IoMapOutline, IoWifiOutline } from "react-icons/io5";
import { PeerProps } from "./ConsumerPeer";


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

  const providerPeers: {
    name: string;
    id: string;
    country_code: string;
    label: string;
  }[] = (await prisma.peer.findMany({
    where: { kind: "provider", pubkey: { not: null } },
    select: {
      name: true,
      id: true,
      country_code: true,
      label: true,
    },
  })).map((peer) => ({
    name: peer.name || "",
    id: peer.id || "",
    country_code: peer.country_code || "",
    label: peer.label || "",
  }));


  // We're a Provider, return stats and no target
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


let isProvider = false
if (props.peer.kind == "provider") {
  isProvider = true
}


{/* wifi settings / hide for cloud providers */ }
{
  isProvider && (
    <>
      <div className="md:p-12 box row-start-3 col-start-1 md:col-start-3 col-span-6 md:col-span-4">
        <h2 className="text-gray text-sm mt-8 dark:border-gray-dark">Wifi Settings</h2>
        {/* <p className="text-xs text-gray">hide me if this is a cloud provider</p> */}
        <form onSubmit={submitData} className="max-w-xl">

          {/* SSID */}
          <div className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white border border-gray-lightest dark:border-gray-dark rounded-sm px-3 py-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue mt-4">
            <label htmlFor="name" className="block text-xs text-gray-light">
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
            <label htmlFor="name" className="block text-xs text-gray-light">
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
                  <Listbox.Label className="block text-xs text-gray-light">Wifi Mode</Listbox.Label>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-sm border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 sm:text-sm">
                      <span className="block truncate">{wifi_preference}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>


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
                  <Listbox.Label className="block text-xs text-gray-light">Channel</Listbox.Label>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-sm border-none  bg-boring-white text-boring-black dark:bg-boring-black dark:text-boring-white py-2 pl-3 pr-10 text-left  focus:outline-none focus:ring-0 sm:text-sm">
                      <span className="block truncate">{channel}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>


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
                  </div>
                </>
              )}
            </Listbox>
          </div>



          {/* Country Code */}
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
                  </div>
                </>
              )}
            </Listbox>
          </div>

          <button
            type="submit"
            className="my-6 mr-2 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-light hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm focus:ring-blue "
          >
            Save Changes
          </button>
        </form>

      </div>
    </>
  )
}
