import { ThemeProvider } from 'next-themes'
import '../styles/global.css';
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import Router from 'next/router';
import nProgress from 'nprogress'; //nprogress module
//import 'nprogress/nprogress.css'; //styles of nprogress
import '../styles/nprogress.css';
import '../styles/toast.css';

//Binding events. 

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

// Default styles that can be overridden by passing styles to the <WalletMultiButton> component.
require('@solana/wallet-adapter-react-ui/styles.css');


// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      //new SolanaMobileWalletAdapter({
      //  appIdentity: { name: "Solana Wallet Adapter App" },
      // authorizationResultCache: createDefaultAuthorizationResultCache(),
      //}),

      // need to update this to pass the proper args for solana mobile wallet to work
      //new SolanaMobileWalletAdapter(),
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

          <ThemeProvider attribute="class">
            <Component {...pageProps} />
            </ThemeProvider>

          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
