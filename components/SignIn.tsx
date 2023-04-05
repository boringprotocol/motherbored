// components/SignIn.tsx
import { useEffect } from 'react';
import { IoWalletOutline } from 'react-icons/io5';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { SigninMessage } from '../utils/SigninMessage';
import bs58 from 'bs58';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { BrowserView, MobileView } from 'react-device-detect';

const SignIn = () => {
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
        statement: `Sign this message to access the Motherbored.`,
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

  return (
    <>
      <BrowserView>
        <a href="#" className="btn btn-outline btn-xs" onClick={handleSignIn}>
          <IoWalletOutline className="mr-2" /> Connect Wallet
        </a>
      </BrowserView>

      <MobileView>
        <a href="#" className="btn btn-outline btn-xs" onClick={handleSignIn}>
          <IoWalletOutline className="mr-2" /> Connect Wallet
        </a>
      </MobileView>
    </>
  );
};

export default SignIn;
