import React from 'react';
import Waiting from '../components/art/waiting';
import WtfCat from '../components/art/wtf-cat';
import SiteMenu from '../components/siteMenu';
import ThemeChanger from '../components/themeChanger';
import ReactPlayer from 'react-player'
import Prices from '../components/Prices';

const Error404 = () => {
  return (
    <div className='top-0 font-jetbrains'>

      <header className="fixed top-0 z-30 w-full px-2 py-4 sm:px-4">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <a href="#">
            <span className="text-2xl">mothebored.app</span>
          </a>
          <div className="flex items-center space-x-1">
            <ul className="hidden space-x-2 md:inline-flex">
              <li className="align-middle">
                <a href="#" className="px-4 py-2 font-semibold text-gray-600 rounded">Docs</a>
              </li>
              <li className="align-middle">
                <a href="#" className="px-4 py-2 font-semibold text-gray-600 rounded">About Us</a>
              </li>
              <li className="align-middle">
                <a href="#" className="px-4 py-2 font-semibold text-gray-600 rounded">Contact Us</a>
              </li>
              <li className="align-middle"><ThemeChanger /></li>
              <li className="align-middle"><SiteMenu /></li>
            </ul>
            <div className="inline-flex md:hidden">
              <button className="flex-none px-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
                <span className="sr-only">Open Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>



      <div className="fixed bottom-0 -z-10 w-full text-gray-dark">
        <WtfCat />
      </div>
      {/* <ThemeChanger /> */}
      <div className="flex h-full flex-col pt-16 pb-12 z-50" style={{ height: '100vh' }}>
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <a href="/" className="inline-flex">
              <span className="sr-only">motherbored.app</span>
            </a>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="">404</p>
              <h1 className="mt-2 text-4xl sm:text-3xl">Moon not found.</h1>
              <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the moon you’re looking for.</p>
              <div className="mt-6">
                <Prices />
                <div className="w-12">


                  {/* <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' /> */}

                </div>
              </div>
            </div>
          </div>

        </main>
        <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-6 lg:px-8">

          <nav className="flex justify-center space-x-4">
            <a href="/" className="text-sm">
              motherbored.app
            </a>
            <span className="inline-block border-l border-gray-300" aria-hidden="true" />
            <a href="#" className="text-sm">
              Contact Support
            </a>
            <span className="inline-block border-l border-gray-300" aria-hidden="true" />
            <a href="#" className="text-sm">
              Nostr
            </a>
          </nav>
        </footer>
      </div>
    </div>

  );
};

export default Error404;
