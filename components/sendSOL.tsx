import React from 'react';
import {
  WalletNotConnectedError,
  SignerWalletAdapterProps
} from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount
} from '@solana/spl-token';
import {
  PublicKey,
  Transaction,
  Connection,
  TransactionInstruction
} from '@solana/web3.js';

export const configureAndSendCurrentTransaction = async (
  transaction: Transaction,
  connection: Connection,
  feePayer: PublicKey,
  signTransaction: SignerWalletAdapterProps['signTransaction']
) => {
  const blockHash = await connection.getLatestBlockhash();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockHash.blockhash;
  const signed = await signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction({
    blockhash: blockHash.blockhash,
    lastValidBlockHeight: blockHash.lastValidBlockHeight,
    signature
  });
  return signature;
};

const SendSolanaSplTokens: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const handlePayment = async () => {
    try {
      if (!publicKey || !signTransaction) {
        throw new WalletNotConnectedError();
      }
      const mintToken = new PublicKey(
        'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3'
      ); // BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3 is BOP token address on solana mainnet
      const recipientAddress = new PublicKey(
        'token receiver solana account address'
      );

      const transactionInstructions: TransactionInstruction[] = [];
      const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      const associatedTokenTo = await getAssociatedTokenAddress(
        mintToken,
        recipientAddress
      );
      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            recipientAddress,
            mintToken
          )
        );
      }
      transactionInstructions.push(
        createTransferInstruction(
          fromAccount.address, // source
          associatedTokenTo, // dest
          publicKey,
          1000000 // transfer 1 USDC, USDC on solana devnet has 6 decimal
        )
      );
      const transaction = new Transaction().add(...transactionInstructions);
      const signature = await configureAndSendCurrentTransaction(
        transaction,
        connection,
        publicKey,
        signTransaction
      );
      // signature is transaction address, you can confirm your transaction on 'https://explorer.solana.com/?cluster=devnet'
    } catch (error) { }
  };

  return (
    <>
      <p>claim wallet: 27n3496mo534785cnoq87345</p>
      <div className="radial-progress" style={{ "--value": "70", "--size": "12rem", "--thickness": "2px" }}>70%</div>
      <button className="btn btn-outline" onClick={handlePayment}>BORE</button>
      - 20M - Public Sale
      - 40M - BOP holders
      - 25M - Platform Incentive Rewards
      - 15M - Partnerships / Team
    </>
  )
};

export default SendSolanaSplTokens;
