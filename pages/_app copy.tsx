import { ThemeProvider } from 'next-themes'
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter, CoinbaseWalletAdapter, BraveWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import SolanaProviderWrapper from '../components/SolanaProviderWrapper';
import MetamaskProviderWrapper from '../components/MetaMaskProviderWrapper';
import { QueryClient, QueryClientProvider } from 'react-query'

// `useSession()` anywhere to access the `session` object.
export default function Mothebored({ Component, pageProps: { session, ...pageProps } }: any) {

  const queryClient = new QueryClient();

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


    // <QueryClientProvider client={queryClient}>
    //   <MetamaskProviderWrapper>
    <SolanaProviderWrapper endpoint={endpoint} wallets={wallets}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ThemeProvider attribute="class">
          <div className="min-h-screen ">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SessionProvider>
    </SolanaProviderWrapper>
    //   </MetamaskProviderWrapper>
    // </QueryClientProvider>
  );
}
