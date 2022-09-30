import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from "bs58"
import { useEffect } from 'react'
import { IoWalletOutline } from 'react-icons/io5'


export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

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

  return (
    <header>
      <div className="py-4">
      <p className="">
        
          {session?.user && (
            <>
              {/* Wallet Address display */}
              <span className="font-jetbrains text-xs">
                {session.user.email ?? session.user.name}
              </span>
              
              

            </>
          )}
        </p>
      </div>

    </header>
  );
}
