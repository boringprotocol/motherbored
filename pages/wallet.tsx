import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { Connection, GetProgramAccountsFilter, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"


//BopTokenMint, SolTokenMint, and UsdcTokenMint defined first so that they can be accessed by both the getServerSideProps and getTokenAccounts functions.
const BopTokenMint = 'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3';
const SolTokenMint = 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj';
const UsdcTokenMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';


async function getTokenAccounts(wallet: string, solanaConnection: Connection, mintAddresses: string[]) {

  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: wallet,  //our search criteria, a base58 encoded string
      },
    }];
  
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, 
    { filters: filters }
  );
  
  console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
  const filteredAccounts = accounts.filter(account => {
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    return mintAddresses.includes(mintAddress);
  });

  let balance = {};
  filteredAccounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    //Log results
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
    balance[mintAddress] = tokenBalance;
  });
  return balance
}


const mintAddressToPropNameMap = {
  'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3': 'bop',
  'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj': 'sol',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'usdc',
};

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    return { props: { hasSession: false } }
  }

  // find token balances
  const rpcEndpoint = 'https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/';
  const solanaConnection = new Connection(rpcEndpoint);
  const mintAddresses = [BopTokenMint, SolTokenMint, UsdcTokenMint];
  const balance = await getTokenAccounts(session.user.name, solanaConnection, mintAddresses);

  const mappedBalance = {};
  Object.entries(balance).forEach(([mintAddress, amount]) => {
    const propName = mintAddressToPropNameMap[mintAddress];
    mappedBalance[propName] = amount;
  });

  return {
    props: { hasSession: true, wallet: session.user.name, ...mappedBalance }
  }
}


type Props = {
  [mintAddressToPropNameMap[BopTokenMint]]: number,
  [mintAddressToPropNameMap[SolTokenMint]]: number,
  [mintAddressToPropNameMap[UsdcTokenMint]]: number
}



const Wallet: React.FC<Props> = (props) => {

  const { data: session, status } = useSession();
  if (!session) {

    return (

      // Not AUTHENTICATED 
      <Layout>
        <Head>
          <title>Boring Protocol</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      </Layout>
    );
  }
  return (

    // AUTHENTICATED
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      {/* Main content */}
      <div>
        <h1 className="text-xs">boring-wallet</h1>
        <div>
          <p>BOP: {props.bop}</p>
          <p>SOL: {props.sol}</p>
          <p>USDC: {props.usdc}</p>
          
        </div>
      </div>
      
    </LayoutAuthenticated>
  );
}

export default Wallet
