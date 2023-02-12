import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import { IoMapOutline } from 'react-icons/io5';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const countryFilter = () => {
  return (
    <>
      <Menu as="div" className="float-right relative inline-block ">
        <div>
          <Menu.Button className="inline-flex w-full justify-center bg-boring-white dark:bg-boring-black px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-gray-100">
            <IoMapOutline />
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
          <Menu.Items className="dark:border dark:border-gray-dark absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-sm bg-boring-white dark:bg-boring-black  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    US
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    NL
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    JP
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    JP
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    JP
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-lightest dark:bg-gray-dark dark:text-boring-white text-boring-black' : 'text-gray-700',
                      'inline-flex items-center px-4 py-2 text-sm'
                    )}
                  >
                    JP
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu></>
  );
}

export default countryFilter
