import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import HeaderAuthenticated from './headerAuthenticated'
import Link from 'next/link'
import Docs from './asides/docs'
import { IoAppsOutline, IoServerOutline } from 'react-icons/io5'
import SiteMenu from './siteMenu'
import Setup from './asides/setup'
import ThemeChanger from './themeChanger'
import JupterAgg from './asides/jupiterAgg'
import GenesysGo from './asides/genesys'
import AccountCard from './asides/accountCard'

<ThemeChanger />

interface Props {
  children: React.ReactNode;
}

// here we go
export default function Layout({ children }: Props) {
  // some layout sorcery
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // ui switches / toggles
  const [enabled, setEnabled] = useState(false)

  return (
    <>
      <div className="flex h-screen text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">

        {/* Narrow sidebar */}
        <div className="hidden w-12 overflow-y-auto md:block border-r bg-boring-white dark:bg-boring-black border-gray-light dark:border-gray-dark z-10">
          <div className="flex w-full flex-col items-center">
            <div className="hover:bg-gray-lightestest dark:hover:bg-gray-dark flex flex-shrink-0 items-center">
              <Link href="/">
                <a className="text-orange dark:text-orange hover:text-black py-3">
                  <svg width="100%" height="100%" viewBox="0 0 262 262" xmlns="http://www.w3.org/2000/svg">
                    <g id="Boring-Logo-Path-1">
                      <path id="Path" fill="currentColor" stroke="none" d="M 99.564003 165.505997 C 99.564003 178.268005 107.250999 189.772003 119.041 194.656006 C 130.830994 199.539993 144.401993 196.839996 153.425003 187.815994 C 162.449005 178.792999 165.149002 165.222 160.264999 153.432007 C 155.380997 141.641998 143.876999 133.955002 131.115005 133.955002 C 122.747002 133.955002 114.722 137.279007 108.805 143.195999 C 102.888 149.113007 99.564003 157.138 99.564003 165.505997 Z M 146.544998 165.505997 C 146.544998 171.746994 142.785995 177.373993 137.020004 179.761993 C 131.253998 182.149994 124.616997 180.830002 120.204002 176.417007 C 115.791 172.003998 114.471001 165.367004 116.859001 159.600998 C 119.248001 153.835007 124.874001 150.076004 131.115005 150.076004 C 139.632996 150.085007 146.535995 156.988007 146.544998 165.505997 Z M 207 165.313004 C 207 207.416 172.981003 241.546005 131 241.546005 C 89.018997 241.546005 55 207.416 55 165.313004 C 54.979 152.158997 58.368 139.225006 64.837997 127.77301 C 65.545334 126.518326 66.288666 125.28566 67.068001 124.074997 C 67.097 124.028992 67.127998 123.983002 67.163002 123.93399 C 71.343002 117.718002 77.589996 111.440002 86.807999 103.283997 C 94.366997 96.597 103.925003 88.64801 115.978996 78.445999 C 115.902 77.820999 115.863998 77.192993 115.862999 76.563004 C 115.866997 69.951996 120.139 64.097992 126.435997 62.078995 C 132.733002 60.059998 139.613007 62.337006 143.460999 67.714996 C 147.309006 73.09201 147.244995 80.338989 143.302002 85.64801 C 139.358994 90.955994 132.438995 93.110992 126.18 90.981003 C 116.301003 99.26001 102.502998 110.867004 98.939003 114.01001 C 97.690002 115.113007 96.305 116.356995 94.862999 117.686996 C 89.566002 121.722992 84.976997 126.610992 81.280998 132.149994 L 81.101997 132.414993 C 74.620003 142.231995 71.174004 153.742004 71.193001 165.505997 C 71.193001 198.653 97.966003 225.520004 131.011993 225.520004 C 164.057007 225.520004 190.830002 198.653 190.830002 165.505997 C 190.858002 145.593002 181.007004 126.964996 164.533997 115.779999 L 164.348007 115.619995 C 162.313995 113.856995 161.153 111.292999 161.169006 108.60199 C 161.186005 105.910004 162.378998 103.360992 164.434006 101.623001 C 164.710999 101.389008 164.973999 101.139999 165.223007 100.876999 C 166.016998 100.104004 166.748001 99.268997 167.408005 98.378998 C 170.807999 93.902008 176.335007 83.825989 173.5 68.569 C 169.828995 48.848999 151.188995 38.485992 138.666 38.485992 L 104.803001 38.485992 C 96.675003 38.485992 90.086998 45.074005 90.086998 53.201996 L 90.086998 77.781006 L 73.966003 91.713989 L 73.966003 50.835999 C 75.152 33.352997 91.273003 22.268997 103.136002 22.268997 L 138.401001 22.268997 C 141.328995 22.268997 174.578995 23.466995 187.628998 58.781006 C 194.891998 79.07901 187.052994 98.744003 180.720001 107.080994 C 180.494995 107.363007 180.531998 107.770996 180.802994 108.007996 C 196.679993 121.96701 207 142.466995 207 165.313004 Z" />
                    </g>
                  </svg>
                </a>
              </Link>
            </div>
              <Link href="/directory" className='hello'>
                <a className="hover:bg-gray-lightestest dark:hover:bg-gray-dark py-4 flex flex-shrink-0 items-center border-t border-b border-gray-lightest dark:border-gray-dark" title=
                "Provider Directory">
                  <IoServerOutline className="w-12 text-1xl" />
                </a>
              </Link>
              <Link href="/peers" className=''>
                <a className="hover:bg-gray-lightestest dark:hover:bg-gray-dark py-4 flex flex-shrink-0 items-center border-b border-gray-lightest dark:border-gray-dark">
                  <IoAppsOutline className="w-12 text-1xl"  />
                </a>
              </Link>     
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 lg:hidden " onClose={setMobileMenuOpen}>
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
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col pt-5 pb-4 bg-boring-white dark:bg-boring-black border-r border-gray-lightest dark:border-gray-dark">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0  bg-boring-white dark:bg-boring-black border-none">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center  focus:outline-none focus:ring-2 focus:ring-blue"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-boring-black dark:text-boring-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    {/* maybe put wallet address here */}
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-6">
                    <nav className="flex h-full flex-col">
                      <div className="font-jetbrains space-y-1">
                        <h1 className="text-xs mt-4 mb-4">Boring Protol <span className="text-xs text-gray py-6">dev-preview</span></h1>

                        <ThemeChanger />

                        <SiteMenu />

                        <Setup />

                       <AccountCard />


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
              <button
                type="button"
                className="border-r border-gray-light dark:border-gray-dark px-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex flex-1 justify-between px-4 sm:px-6">
                <div className="flex flex-1">
                  <HeaderAuthenticated />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-scroll hover:overflow-y-scroll">
              {/* Primary column */}
              <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                <div>
                  <main className=''>
                    {children}
                  </main>
                </div>
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="drop-shadow-2xl z-10 hidden overflow-y-scroll hover:overflow-y-scroll w-96 border-l border-gray-light dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black lg:block">
              <div className="font-jetbrains text-xs py-4">

                <nav className="flex h-full flex-col px-12">
                  <div className="font-jetbrains space-y-1">
                    <ThemeChanger />
                    <h1 className="text-xs mt-4 mb-4 py-4">Boring Protocol <span className="text-xs text-gray py-6">dev-preview</span></h1>
                    <AccountCard />
                    <SiteMenu />
                    <Setup />
                  </div>
                </nav>

                <Docs />
                <GenesysGo />
                <JupterAgg />

              </div>

            </aside>

          </div>
        </div>
      </div>
    </>




  );
}
