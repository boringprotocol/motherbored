import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from "./header"
import Link from 'next/link'
import { useTheme } from 'next-themes'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="font-jetbrains text-xs p-12">
      The current theme is: <span className="capitalize">{theme}</span><br /><br />
      <button className='p-1 mr-3 bg-white text-black' onClick={() => setTheme('light')}>Light Mode</button>
      <button className='p-1 bg-white text-black' onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}

const userNavigation = [
  { name: 'Your Account', href: '/me' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (

    <>
      <div className="flex h-full text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
        
        {/* Narrow sidebar */}
        <div className="hidden w-22 overflow-y-auto md:block border-r border-gray-light dark:border-gray-dark">
          <div className="flex w-full flex-col items-center py-2">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <img
                  className="h-14 w-auto"
                  src="/img/logo/mark.svg"
                  alt="Boring Protocol"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 md:hidden " onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray bg-opacity-5" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4 bg-boring-black border-r border-gray-dark">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1 bg-black">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="/img/logo/mark.svg"
                      alt="Boring Protocol"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col">
                      <div className="font-jetbrains space-y-1">
                        nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here nothing to see here YET
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="font-jetbrains flex flex-1 flex-col overflow-hidden dark:bg-boring-black">
          <header className="w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-light dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black  shadow-sm">

            {/* <pre className="font-jetbrains text-xs p-2">layout.tsx header</pre> */}
              <button
                type="button"
                className="border-r border-gray-light dark:border-gray-dark px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex flex-1 justify-between px-4 sm:px-6">
                <div className="flex flex-1">
                  <Header />
                </div>
                <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6 ">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://source.boringavatars.com/pixel/"
                          alt=""
                        />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-boring-black py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {/* Primary column */}
              <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                <h1 id="primary-heading" className="sr-only">
                sr-only
                </h1>
                <div>


                  <main className='px-14 pt-24'>
                    {children}</main>
                </div>
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden w-96 overflow-y-auto border-l border-gray-light dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black lg:block">
            
            <pre className="font-jetbrains text-xs p-2 text-gray">layout.tsx aside</pre>


              <ThemeChanger />

              <div className="font-jetbrains text-xs p-12">
              Bring User and Peer props into this content block.
              </div>                                  
                                  

            </aside>


          </div>
        </div>
      </div>
    </>




  );
}
