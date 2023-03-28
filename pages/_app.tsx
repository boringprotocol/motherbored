// /shit/_app.tsx
import '../styles/global.css';
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { CoinbaseWalletAdapter, PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ThemeContextProvider } from 'Themes/themeContext';
import { ClaimContextProvider } from 'contexts/ClaimContext';
import Router from 'next/router';
import nProgress from 'nprogress';
import '../styles/nprogress.css';

//Binding events. 
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

// Default styles that can be overridden by your app
// removing this cocksucker will break the modal and nobody gets in
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps: { session, ...pageProps } }: any) {

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
                  <Component {...pageProps} />
                </div>
              </ClaimContextProvider>
            </ThemeContextProvider>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
