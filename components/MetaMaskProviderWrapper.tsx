import MetaMaskProvider from "./MetaMaskProvider";
import { useMemo } from 'react';
import { SiweMessage } from 'siwe';
import { createClient, useSignMessage, useNetwork, configureChains, mainnet, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

type MetaMaskProviderWrapperProps = {
  children: any;
};

export default function MetaMaskProviderWrapper({ children }: MetaMaskProviderWrapperProps) {
  const queryClient = new QueryClient();
  const network = useNetwork();

  const { chains, provider } = configureChains([mainnet], [publicProvider()]);

  const client = createClient({
    connectors: [
      new InjectedConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
    ],
    provider,
  });

  const requestAccounts = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      return accounts;
    }
  };

  const handleSignMessage = async (message: SiweMessage) => {
    const { ethereum } = window;

    const signer = ethereum.selectedAddress;
    const signature = await useSignMessage(message, signer);

    return { message: message.serialize(), signature };
  };

  const providerOptions = useMemo(() => {
    return {
      requestAccounts,
      handleSignMessage,
      chainId: network.chain,
    };
  }, [requestAccounts, handleSignMessage, network.chain]);

  return (
    <WagmiConfig client={client}>
      <QueryClientProvider client={queryClient}>
        <MetaMaskProvider providerOptions={providerOptions}>
          {children}
        </MetaMaskProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
