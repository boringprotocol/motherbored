import { createContext, useContext, useEffect, useState } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

export const MetaMaskContext = createContext(null);

type MetaMaskProviderProps = {
  children: any;
};

function MetaMaskProvider({ children }: MetaMaskProviderProps) {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);

  useEffect(() => {
    const getProvider = async () => {
      if (window.ethereum) {
        const provider = window.ethereum;
        try {
          await provider.request({ method: 'eth_requestAccounts' });
          setProvider(provider);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.warn('No Ethereum provider found');
      }
    };
    getProvider();
  }, []);

  return (
    <MetaMaskContext.Provider value={provider}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export default MetaMaskProvider;
