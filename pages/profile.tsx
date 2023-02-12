import React from 'react';
import WtfCat from '../components/art/wtf-cat';
import SiteMenu from '../components/siteMenu';
import ThemeChanger from '../components/themeChanger';

const Profile = () => {
  return (
    <div className='top-0 font-jetbrains'>

      <header className="fixed top-0 z-30 w-full px-2 py-4 sm:px-4">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <a href="/">
            <span className="text-2xl">motherbored.app</span>
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
      <div className="flex h-full flex-col pt-16 pb-12 z-50" style={{ height: '100vh' }}>
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <a href="/" className="inline-flex">
              <span className="sr-only">Boring Protocol</span>
            </a>
          </div>
          <div className="">

            <section className="bg-blueGray-50">
              <div className="w-full lg:w-4/12 px-4 mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
                  <div className="px-6">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full px-4 flex justify-center">
                        <div className="relative">
                          <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px" />
                        </div>
                      </div>
                      <div className="w-full px-4 text-center mt-20">
                        <div className="flex justify-center py-4 lg:pt-4 pt-8">
                          <div className="mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              7
                            </span>
                            <span className="text-sm text-blueGray-400">Nodes</span>
                          </div>
                          <div className="mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              3
                            </span>
                            <span className="text-sm text-blueGray-400">Countries</span>
                          </div>
                          <div className="lg:mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              89
                            </span>
                            <span className="text-sm text-blueGray-400">Consumers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-12">
                      <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                        Absolute Unit
                      </h3>
                      <h2>Connect</h2>
                      <select>
                        <option value="red-donkey-2874">red-donkey-2874</option>
                        <option value="blue-horse-3847">blue-horse-3847</option>
                        <option value="green-elephant-4938">green-elephant-4938</option>
                        <option value="yellow-lion-1029">yellow-lion-1029</option>
                        <option value="purple-giraffe-5748">purple-giraffe-5748</option>
                        <option value="orange-zebra-6837">orange-zebra-6837</option>
                        <option value="brown-monkey-7926">brown-monkey-7926</option>
                      </select>

                    </div>
                    <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-9/12 px-4">
                          <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                            Not a morning person, but I'm a coffee person. So that's basically the same thing, right???
                            Yo dude!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <footer className="relative  pt-8 pb-6 mt-8">
                <div className="container mx-auto px-4">
                  <div className="flex flex-wrap items-center md:justify-between justify-center">
                    <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                      {/* hello         */}
                    </div>
                  </div>
                </div>
              </footer>
            </section>

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

export default Profile;
