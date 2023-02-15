import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { SigninMessage } from '../utils/SigninMessage';
import bs58 from 'bs58';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Children } from 'react';

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

  const handleMetamaskSignIn = async () => {
    try {
      if (!window.ethereum) {
        console.log('Metamask not found');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || !accounts.length) {
        console.log('No accounts found');
        return;
      }

      const address = accounts[0];

      signIn('metamask', {
        address,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>

      <a href="#" onClick={handleSolanaSignIn} className="">
        Connect Solana Wallet
      </a>
      <a href="#" onClick={handleMetamaskSignIn} className="">
        Connect Metamask Wallet
      </a>
    </>
  );
}
