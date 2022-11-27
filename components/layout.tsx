import { Fragment, useEffect, useState } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import Waiting from './art/waiting'
import { IoMoonOutline, IoSunnyOutline, IoWalletOutline } from 'react-icons/io5'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from 'bs58'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import PhantomLogo from './art/phantom'


// light mode / dark mode
const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className='mt-12 border rounded-sm  border-gray dark:border-black'>
      <button className='text-center inline-flex items-center  text-xs bg-white px-3 py-2 text-boring-black hover:bg-gray-lightestest dark:hover:bg-gray-light border-r border-gray dark:border-black  w-1/2' onClick={() => setTheme('light')}><IoSunnyOutline className="float-left mr-2" /> Light Mode</button>
      <button className='inline-flex items-center text-xs bg-white px-3 py-2 text-boring-black hover:bg-gray-lightestest dark:hover:bg-gray-light w-1/2' onClick={() => setTheme('dark')}><IoMoonOutline className="float-left mr-2" /> Dark Mode</button>
    </div>
  )
}

// Placeholder data for peers stats
const stats = [
  { name: 'Consumers', stat: '54' },
  { name: 'Providers', stat: '30' },
  { name: 'Countries', stat: '48' },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {

  const { data: session, status } = useSession();
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: true,
        signature: serializedSignature,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [wallet.connected, status]);


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [enabled, setEnabled] = useState(false)


  return (

    <>
      <div className="font-jetbrains text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black">

        <div className="p-4">
        <div className='pt-4 text-xs '>A Private Path - motherbored.app - Boring Protocol</div>
        <ThemeChanger />
        
          {/* Network Statitics */}
          <div className="p-4">
            Network Stats
            
            <div className="">
            <dl className="mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.name} className="font-jetbrains  overflow-hidden  text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black py-5">
                  <dt className="truncate text-sm sm:text-sm">{item.name}</dt>
                  <dd className="mt-1 text-2xl sm:text-3xl">{item.stat}</dd>
                </div>
              ))}
            </dl>
            </div>  
          </div>
          {/* end /Network Statitics */}
              
                {/* <Waiting /> */}
              

          <BrowserView>
          Desktop Options<br></br>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Phantom
            </a>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Metamask
            </a>

            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Ledger
            </a>
          </BrowserView>

          <MobileView>
            Mobile Options<br></br>

            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Phantom
            </a>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Metamask
            </a>

            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Ledger
            </a>
            {/* <a className="m-4 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" href="https://phantom.app/ul/browse/https%3A%2F%2Fboring-falcon.netlify.app"><IoWalletOutline className="mr-2" />Connect Phantom</a> */}
          </MobileView>


        <p className="mt-4 text-xs text-boring-black dark:text-gray">iOS and Android users should be able to use the Phantom or Metamask wallet's in-app browsers to access this Motherbored GUI.  </p>
        <div className='text-boring-black dark:text-boring-white mt-4'>     
        {/* <PhantomLogo />     */}
        <a className="border p-2" href="https://docs.motherbored.app" target="_blank">Docs</a> | <a  className="border p-2" href="https://store.motherbored.limited">Store</a>
        </div>

        <p className="mt-4 text-xs text-gray"><a className="underline" href="http://localhost:3000/directory/">Find a provider</a> to connect to</p>
      </div>
    </div>
    </>

  );
}
