import { signOut } from "next-auth/react";
import { IoLogOutOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const AccountCard = () => {
    return (

        <div className="bg-boring-white dark:bg-boring-black border border-gray-lightest dark:border-gray-dark p-2">
            <div className="flex space-x-3">
                <div className="flex-shrink-0">
                    <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">
                        oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V
                    </p>
                </div>
                <div className="flex flex-shrink-0 self-center">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-sm bg-boring-white dark:bg-boring-black shadow-lg ring-1 ring-gray-light dark:ring-gray-dark focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/profile"
                                                className={classNames(
                                                    active ? 'bg-gray-lightestest dark:bg-gray-dark text-black dark:text-white' : 'text-gray',
                                                    'flex px-4 py-2 text-xs'
                                                )}
                                            >
                                                <IoSettingsOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                                <span>Profile</span>
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/wallet"
                                                className={classNames(
                                                    active ? 'bg-gray-lightestest dark:bg-gray-dark text-black dark:text-white' : 'text-gray-700',
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
                                                    active ? 'bg-gray-lightestest dark:bg-gray-dark text-black dark:text-white' : 'text-gray-700',
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
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>

    );
}

export default AccountCard
