import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'
import Head from 'next/head'

import { Connection, GetProgramAccountsFilter, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

const BopTokenMint = 'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3';
const UsdcTokenMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
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
    TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    { filters: filters }
  );
  console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
  let bopTokenBalance = 0;
  let usdcTokenBalance = 0;
  accounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const bopBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    const usdcBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    //Log results
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${bopBalance}`);
    console.log(`--Token Balance: ${usdcBalance}`);
    if (mintAddress == BopTokenMint) {
      bopTokenBalance = bopBalance
    }
    if (mintAddress == UsdcTokenMint) {
      usdcTokenBalance = usdcBalance
    }
  });
  return bopTokenBalance + usdcTokenBalance
}

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { peers: [], tokenAccounts: [] } }
  }

  const user = await prisma.user.findFirst({
    where: { wallet: session.user.name }
  })


  // wtf is this
  // if (!user) {
  //   if (session.user.name) {
  //     const sessionUser = session.user.name
  //     const user = await prisma.user.create({
  //       data: {
  //         wallet: sessionUser,
  //       },
  //     })
  //   }
  // }

  // findbop
  const rpcEndpoint = 'https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/';
  const solanaConnection = new Connection(rpcEndpoint);
  const bopAmount = await getTokenAccounts(session.user.name, solanaConnection);
  const usdcAmmount = await getTokenAccounts(session.user.name, solanaConnection);

  // const peers = await prisma.peer.findMany({
  //   where: { userId: user?.id },
  // })

  return {
    props: { bop: bopAmount, usdc: usdcAmmount },
  }
}

type Props = {
  bop: string,
  usdc: string,
}

const IndexPage: React.FC<Props> = (props) => {

  // const { data } = useSession(); // do we need this here? 
  const { data: session, status } = useSession();
  if (!session) {

    return (

      // NOT AUTHENTICATED
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

      <div>
        bop: {props.bop} | usdc: {props.usdc}
      </div>
      
    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default IndexPage