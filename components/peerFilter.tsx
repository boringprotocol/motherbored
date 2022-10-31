import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import { IoCloudOutline, IoFilterOutline, IoLaptopOutline, IoServerOutline } from 'react-icons/io5';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }

const peerFilter = () => {
    return ( 
        <>
          <Menu as="div" className="float-right relative inline-block ">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center bg-white px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-gray-100">
                    <IoFilterOutline className="h-4 w-4" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'inline-flex items-center px-4 py-2 text-sm'
                              )}
                            >
                              <IoCloudOutline className="mr-2" /> Local Peers
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray text-gray' : 'text-gray-700',
                                'inline-flex items-center px-4 py-2 text-sm'
                              )}
                            >
                              <IoServerOutline className="mr-2" /> Cloud Peers
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'inline-flex items-center px-4 py-2 text-sm'
                              )}
                            >
                              <IoLaptopOutline className="mr-2" /> Consumer Peers
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu></>
     );
}
 
export default peerFilter
