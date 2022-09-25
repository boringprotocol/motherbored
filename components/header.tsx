import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { SigninMessage } from '../utils/SigninMessage'
import bs58 from "bs58"
import { useEffect } from 'react'


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
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="py-2">
        <p
          className=""
        >
          {!session && (
            <>
              <a href="#" className="font-jetbrains text-xs p-1 bg-white text-boring-black " onClick={handleSignIn}>
                Connect Wallet
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className="w2 h2 cover"
                />
              )}
              {/* Wallet Address display */}
              <span className="font-jetbrains text-xs">
                
                {session.user.email ?? session.user.name}
              </span>
              <a
                href={`/api/auth/signout`}
                className="ml-6 mt-2 inline-flex items-center text-xs text-boring-black dark:text-boring-black bg-white dark:bg-white px-1 py-1 shadow"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>

    </header>
  );
}
