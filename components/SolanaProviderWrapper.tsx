import { createContext, useContext } from 'react';
import SolanaProvider from './SolanaProvider';

export const SolanaContext = createContext(null);

type SolanaProviderWrapperProps = {
  endpoint: string;
  wallets: any;
  children: any;
};

function SolanaProviderWrapper({ endpoint, wallets, children }: SolanaProviderWrapperProps) {
  return (
    <SolanaProvider endpoint={endpoint} wallets={wallets}>
      <SolanaContext.Provider value={useContext(SolanaContext)}>
        {children}
      </SolanaContext.Provider>
    </SolanaProvider>
  );
}

export default SolanaProviderWrapper;
