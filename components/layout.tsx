import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { SigninMessage } from '../utils/SigninMessage';
import bs58 from 'bs58';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaMaskInpageProvider } from "@metamask/providers";
import TextCycle from './TextCycle';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

export default function Layout() {
  const { status } = useSession();
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSolanaSignIn = async () => {
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

      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: true,
        signature: serializedSignature,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleMetamaskSignIn = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       console.log('Metamask not found');
  //       return;
  //     }

  //     const accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });

  //     if (!accounts || !accounts.length) {
  //       console.log('No accounts found');
  //       return;
  //     }

  //     const address = accounts[0];

  //     signIn('metamask', {
  //       address,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>

      <div className="font-jetbrains flex min-h-full flex-col">

        <main className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
          <p className="text-base font-semibold leading-8 text-boring-blue">BORING PROTOCOL</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Motherbored.app</h1>
          <p className="my-6 text-base leading-7 text-gray-600">Launch Nodes or set-up a <a href="" className="border-b border-dotted">Boring VPN</a> client. </p>

          <button className="border border-gray p-3" onClick={handleSolanaSignIn}>
            Connect Solana Wallet
          </button>
          {/* <a className="border border-gray p-3" href="#" onClick={handleMetamaskSignIn}>
            Connect EVM Wallet
          </a> */}

          <div id="TextCycle" className="">
            <TextCycle />
          </div>



          <div className="mt-10">
            <a href="http://localhost:3002" className="text-sm font-semibold leading-7 text-boring-blue">
              <span aria-hidden="true">&larr;</span> Back to home
            </a>
          </div>
        </main>

      </div>


    </>
  );
}
