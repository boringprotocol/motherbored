import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from './header'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Switch } from '@headlessui/react'
import Waiting from './art/waiting'
import { IoDownloadOutline, IoLinkOutline, IoWalletOutline } from 'react-icons/io5'
import Image from 'next/image'
import uiScreenshot from '/public/img/ui-screenshot.png'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from 'bs58'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

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


      <div className="flex items-center justify-center h-screen text-white">
        <div className="">
          <div className='font-jetbrains '>
          <div className='p-2 text-sm '><span className="text-orange">Boring</span> Protocol</div>
            <div className='p-2 text-xs'>A <span className=" text-yellow">Private</span> Path</div>
            <Waiting />
          </div>

          <BrowserView>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Wallet
            </a>
          </BrowserView>

          <MobileView>
            <a className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" href="https://phantom.app/ul/browse/https%3A%2F%2Fboring-falcon.netlify.app"><IoWalletOutline className="mr-2" />Connect Phantom</a>
          </MobileView>

        <div className=''>         
          <button className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white"><IoLinkOutline className="mr-2" /> Get Motherbored</button>
        </div>

        <p className="text-xs text-gray"></p>
      </div>
    </div>
    </>

  );
}
