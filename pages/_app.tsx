// /pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { CoinbaseWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { ThemeContextProvider } from "../Themes/themeContext";
import { ClaimContextProvider } from "../contexts/ClaimContext";

import Router from 'next/router';
import '../styles/global.css';

// Progress bar
import nProgress from 'nprogress';
import '../styles/nprogress.css';

// Notifications
import '../styles/toast.css';

//Progress bar binding events
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

// require('@solana/wallet-adapter-react-ui/styles.css');

// development and production URLs
const motherboredAppDev = 'http://localhost:3001'; // NODE_ENV=development PORT=3001 npm run dev
const motherboredAppProd = 'https://motherbored.app'; // NODE_ENV=production PORT=3001 npm run dev
const boringProtocolDev = 'http://localhost:3002'; // NODE_ENV=development PORT=3002 npm run dev
const boringProtocolProd = 'https://boringprotocol.io'; // NODE_ENV=production PORT=3002 npm run dev
const motherboredDocsDev = 'http://localhost:3003'; // NODE_ENV=development PORT=3003 npm run dev
const motherboredDocsProd = 'https://docs.motherbored.app'; // NODE_ENV=production PORT=3003 npm run dev

// `useSession()` anywhere to access the `session` object.
export default function Mothebored({ Component, pageProps: { session, ...pageProps } }: any) {

  // PORT=3001 npm run dev
  const motherboredApp =
    process.env.NODE_ENV === 'production' ? motherboredAppProd : motherboredAppDev;
  // PORT = 3003 npm run dev
  const boringProtocol =
    process.env.NODE_ENV === 'production' ? boringProtocolProd : boringProtocolDev;
  // PORT=3003 npm run dev
  const motherboredDocs = process.env.NODE_ENV === 'production' ? motherboredDocsProd : motherboredDocsDev;

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new CoinbaseWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <ThemeContextProvider>
              <ClaimContextProvider>
                <div className="min-h-screen">
                  <Component
                    {...pageProps}
                    motherboredApp={motherboredApp}
                    boringProtocol={boringProtocol}
                    motherboredDocs={motherboredDocs}
                  />
                </div>
              </ClaimContextProvider>
            </ThemeContextProvider>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
