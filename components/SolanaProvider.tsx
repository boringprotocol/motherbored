import { createContext, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export const SolanaContext = createContext(null);

type SolanaProviderProps = {
  endpoint: string;
  wallets: any;
  children: any;
};

function SolanaProvider({ endpoint, wallets, children }: SolanaProviderProps) {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const connection = new Connection(endpoint, 'recent');
    setConnection(connection);

    return () => {
      connection.disconnect();
    };
  }, [endpoint]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>

          <SolanaContext.Provider value={connection}>
            {children}
          </SolanaContext.Provider>

        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default SolanaProvider;
