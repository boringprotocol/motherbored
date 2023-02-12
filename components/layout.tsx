import { IoWalletOutline } from 'react-icons/io5'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from 'bs58'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { BrowserView, MobileView } from 'react-device-detect';
import ThemeChanger from './themeChanger'

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {

  const { status } = useSession();
    console.log(`status: ${status}`);
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

  return (

    <>
    {children}

    <div className="px-6 font-jetbrains md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1 ">
        <h2 className="text-xs mt-6 text-boring-black dark:text-boring-white sm:truncate">
        A Private Path - Boring Protocol
        </h2>
      </div>
      <div className="flex md:mt-0 md:ml-4">
        <ThemeChanger />
      </div>
    </div>
      <div className="font-jetbrains text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black">

        <div className="p-4">
        
              
          <BrowserView>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Wallet
            </a>
          </BrowserView>

          <MobileView>
            <a href="#" className="inline-flex items-center rounded-sm border border-transparent text-xs bg-white px-3 py-2 text-boring-black shadow hover:bg-boring-white" onClick={handleSignIn}>
               <IoWalletOutline className="mr-2"/> Connect Wallet
            </a>
          </MobileView>
        
      </div>
    </div>
    </>

  );
}
