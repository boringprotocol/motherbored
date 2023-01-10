import React, { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://mainnet.solana.com');

const AccountPage = () => {
    const walletAddress = 'oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V'; // Your Solana wallet address
    const tokenAddress = 'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3'; // Your $BOP token contract address
    return (
      <MyComponent walletAddress={walletAddress} tokenAddress={tokenAddress} />
    );
  };
  

const MyComponent = ({ walletAddress, tokenAddress }) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const balanceInLamports = await connection.getBalance({address: walletAddress, contractAddress: tokenAddress});
      setBalance(balanceInLamports);
    };
    fetchData();
  }, [walletAddress, tokenAddress]);

  return (
    <div>
      {balance ? `Your balance is ${balance} Sol` : 'Loading...'}
    </div>
  );
};

export default MyComponent;
