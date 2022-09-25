import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from './header'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Switch } from '@headlessui/react'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="font-jetbrains text-xs">
      {/* The current theme is: <span className="capitalize">{theme}</span><br /><br /> */}
      <button className='p-1 mr-3 bg-black dark:bg-boring-black text-boring-white dark:text-boring-white' onClick={() => setTheme('light')}>Light Mode</button>
      <button className='p-1 bg-white text-black' onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}

const userNavigation = [
  { name: 'Your Account', href: '/me' },
  { name: 'Sign out', href: '#' },
  { name: 'Add Peer', href: '/newpeer' },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [enabled, setEnabled] = useState(false)


  return (

    <>
      <div className="flex h-full text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black ">
        
        {/* Narrow sidebar */}
        <div className="hidden w-12 overflow-y-auto md:block border-r border-gray-light dark:border-gray-dark">
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-shrink-0 items-center mt-3">
              <a href="/" className="text-gray-light dark:text-gray-dark hover:text-black ">
              <svg width="100%" height="100%" viewBox="0 0 262 262" xmlns="http://www.w3.org/2000/svg">
    <g id="Boring-Logo-Path-1">
        <path id="Path" fill="currentColor" stroke="none" d="M 99.564003 165.505997 C 99.564003 178.268005 107.250999 189.772003 119.041 194.656006 C 130.830994 199.539993 144.401993 196.839996 153.425003 187.815994 C 162.449005 178.792999 165.149002 165.222 160.264999 153.432007 C 155.380997 141.641998 143.876999 133.955002 131.115005 133.955002 C 122.747002 133.955002 114.722 137.279007 108.805 143.195999 C 102.888 149.113007 99.564003 157.138 99.564003 165.505997 Z M 146.544998 165.505997 C 146.544998 171.746994 142.785995 177.373993 137.020004 179.761993 C 131.253998 182.149994 124.616997 180.830002 120.204002 176.417007 C 115.791 172.003998 114.471001 165.367004 116.859001 159.600998 C 119.248001 153.835007 124.874001 150.076004 131.115005 150.076004 C 139.632996 150.085007 146.535995 156.988007 146.544998 165.505997 Z M 207 165.313004 C 207 207.416 172.981003 241.546005 131 241.546005 C 89.018997 241.546005 55 207.416 55 165.313004 C 54.979 152.158997 58.368 139.225006 64.837997 127.77301 C 65.545334 126.518326 66.288666 125.28566 67.068001 124.074997 C 67.097 124.028992 67.127998 123.983002 67.163002 123.93399 C 71.343002 117.718002 77.589996 111.440002 86.807999 103.283997 C 94.366997 96.597 103.925003 88.64801 115.978996 78.445999 C 115.902 77.820999 115.863998 77.192993 115.862999 76.563004 C 115.866997 69.951996 120.139 64.097992 126.435997 62.078995 C 132.733002 60.059998 139.613007 62.337006 143.460999 67.714996 C 147.309006 73.09201 147.244995 80.338989 143.302002 85.64801 C 139.358994 90.955994 132.438995 93.110992 126.18 90.981003 C 116.301003 99.26001 102.502998 110.867004 98.939003 114.01001 C 97.690002 115.113007 96.305 116.356995 94.862999 117.686996 C 89.566002 121.722992 84.976997 126.610992 81.280998 132.149994 L 81.101997 132.414993 C 74.620003 142.231995 71.174004 153.742004 71.193001 165.505997 C 71.193001 198.653 97.966003 225.520004 131.011993 225.520004 C 164.057007 225.520004 190.830002 198.653 190.830002 165.505997 C 190.858002 145.593002 181.007004 126.964996 164.533997 115.779999 L 164.348007 115.619995 C 162.313995 113.856995 161.153 111.292999 161.169006 108.60199 C 161.186005 105.910004 162.378998 103.360992 164.434006 101.623001 C 164.710999 101.389008 164.973999 101.139999 165.223007 100.876999 C 166.016998 100.104004 166.748001 99.268997 167.408005 98.378998 C 170.807999 93.902008 176.335007 83.825989 173.5 68.569 C 169.828995 48.848999 151.188995 38.485992 138.666 38.485992 L 104.803001 38.485992 C 96.675003 38.485992 90.086998 45.074005 90.086998 53.201996 L 90.086998 77.781006 L 73.966003 91.713989 L 73.966003 50.835999 C 75.152 33.352997 91.273003 22.268997 103.136002 22.268997 L 138.401001 22.268997 C 141.328995 22.268997 174.578995 23.466995 187.628998 58.781006 C 194.891998 79.07901 187.052994 98.744003 180.720001 107.080994 C 180.494995 107.363007 180.531998 107.770996 180.802994 108.007996 C 196.679993 121.96701 207 142.466995 207 165.313004 Z"/>
    </g>
</svg>
              </a>




            </div>
            {/* <div className="flex flex-shrink-0 items-center border-t border-gray-dark">
              <Link href="/">
                <img
                  className="h-18 w-auto text-black"
                  src="/img/logo/mark.svg"
                  alt="Boring Protocol"
                />
              </Link>
            </div> */}
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 sm:hidden " onClose={setMobileMenuOpen}>
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
                    <div className="absolute top-1 right-0 -mr-14 p-1 bg-boring-white dark:bg-boring-black border border-gray-lightest dark:border-gray-dark">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-boring-black dark:text-boring-white" aria-hidden="true" />
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
                      <ThemeChanger />
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
                className="border-r border-gray-light dark:border-gray-dark px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
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
                      <Menu.Button className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://source.boringavatars.com/sunset/"
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
                                  active ? 'bg-gray-lightest dark:bg-gray-dark' : '',
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
                  <main className=''>
                    {children}</main>
                </div>
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden w-96 overflow-y-auto border-l border-gray-light dark:border-gray-dark text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black lg:block">
            <div className="font-jetbrains text-xs py-4 border-t border-gray-light dark:border-gray-dark">                                  
              
              <div className='px-12 pb-4'>
              <ThemeChanger />
              </div>


            {/* ///// */}
             <div className='py-12 border-t border-gray-light dark:border-gray-dark'>
             <div className='px-12 pb-12'>
             
             <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">Block Ads</span>
        {/* <span className="text-sm text-boring-white">(bla bla bla)</span> */}
      </Switch.Label>
             </Switch.Group>
             <p className='text-xs py-4'>Network-wide Ad Blocking  </p>


              </div>
              </div>

{/* //// */}

              <div className='py-12 border-t border-gray-light dark:border-gray-dark'>
             <div className='px-12 pb-12'>
             
             <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-green' : 'bg-gray-lightest dark:bg-gray-dark',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-white dark:border-boring-black transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue focus:ring-offset-1'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm">Kill Switch</span>
      </Switch.Label>
             </Switch.Group>
             <p className='text-xs py-4'>Do not try to find another peer if this one becomes unavailable. </p>


              </div>
              </div>


              </div>                    
       

              <div className="font-jetbrains text-xs p-12 border-t border-gray-light dark:border-gray-dark">
              <h3>BORING ASTEROIDS</h3>
              <p><a href="/asteroids.html">↑ ↑ ↓ ↓ ← → ← → b a enter</a></p>    
    </div>

            </aside>


          </div>
        </div>
      </div>
    </>




  );
}
