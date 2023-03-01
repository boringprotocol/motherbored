import { ThemeProvider } from 'next-themes'
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter, CoinbaseWalletAdapter, BraveWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import SolanaProviderWrapper from '../components/SolanaProviderWrapper';

// import { MetaMaskProviderWrapper } from '../components/MetaMaskProviderWrapper';

// import { UniversalPrivateKeyProviderWrapper } from '../components/UniversalPrivateKeyProviderWrapper';

import Router from 'next/router';
import '../styles/global.css';

// Progress bar
import nProgress from 'nprogress';
import '../styles/nprogress.css';

// Notifications
import '../styles/toast.css';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

//Progress bar binding events
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

require('@solana/wallet-adapter-react-ui/styles.css');

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
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new BraveWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (

    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <ThemeProvider attribute="class">
              <div className="min-h-screen ">
                <Component {...pageProps} motherboredApp={motherboredApp}
                  boringProtocol={boringProtocol}
                  motherboredDocs={motherboredDocs} />
              </div>
            </ThemeProvider>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>


  );

}
