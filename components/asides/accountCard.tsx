import { signOut, useSession } from "next-auth/react";
import { IoLogOutOutline, IoPersonOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const AccountCard = () => {
    const { data: session } = useSession();

    return (

        <div className="bg-boring-white dark:bg-boring-black border border-gray-lightest dark:border-gray-dark p-2">
            <div className="flex space-x-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-boring-black dark:text-boring-white truncate p-2">
                        {session?.user && (
                            <>
                                {session.user.email ?? session.user.name}
                                <span>oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V</span>
                            </>
                        )}
                    </p>
                </div>
                <div className="flex flex-shrink-0 self-center">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-boring-black dark:text-boring-white hover:text-gray">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon className="h-4 w-4" aria-hidden="true" />
                            </Menu.Button>
                        </div>

                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-sm bg-boring-white dark:bg-boring-black shadow-lg ring-1 ring-gray-light dark:ring-gray-dark focus:outline-none">

                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/profile"
                                            target="_blank"
                                            className={classNames(
                                                active ? 'bg-gray-lightest dark:bg-gray-dark text-black dark:text-white' : 'text-boring-black dark:text-boring-white',
                                                'flex px-4 py-2 text-xs'
                                            )}
                                        >
                                            {/* <IoSettingsOutline className="mr-3 h-4 w-4" aria-hidden="true" /> */}
                                            <IoPersonOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                            <span>View Profile</span>
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/wallet"
                                            className={classNames(
                                                active ? 'bg-gray-lightest dark:bg-gray-dark text-black dark:text-white' : 'text-boring-black dark:text-boring-white',
                                                'flex px-4 py-2 text-xs'
                                            )}
                                        >
                                            <IoWalletOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                            <span>Wallet</span>
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                signOut();
                                            }}
                                            className={classNames(
                                                active ? 'bg-gray-lightest dark:bg-gray-dark text-black dark:text-white' : 'text-boring-black dark:text-boring-white',
                                                'flex px-4 py-2 text-xs'
                                            )}
                                        >
                                            <IoLogOutOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                            <span>Sign Out</span>
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>

                    </Menu>
                </div>
            </div>
        </div>

    );
}

export default AccountCard
