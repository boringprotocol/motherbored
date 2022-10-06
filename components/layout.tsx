import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Waiting from './art/waiting'
import { IoWalletOutline } from 'react-icons/io5'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from 'bs58'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

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
        <div className="p-4">
          <div className='font-jetbrains '>
          {/* <div className='p-2 text-sm '>Boring Protocol</div> */}
            {/* <div className='p-2 text-xs'>A Private Path</div> */}
            <Waiting />
          </div>

          <BrowserView>
            <a href="#" className="m-4 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Wallet
            </a>
          </BrowserView>

          <MobileView>
          <a href="#" className="m-4 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Wallet
            </a>
            {/* <a className="m-4 inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" href="https://phantom.app/ul/browse/https%3A%2F%2Fboring-falcon.netlify.app"><IoWalletOutline className="mr-2" />Connect Phantom</a> */}
          </MobileView>


        <p className="p-4 text-xs text-boring-black dark:text-gray">iOS and Android users should be able to use the Phantom wallet in-app browser to access this Motherbored GUI.  </p>
        <div className=''>         
        </div>

        <p className="text-xs text-gray"></p>
      </div>
    </div>
    </>

  );
}
