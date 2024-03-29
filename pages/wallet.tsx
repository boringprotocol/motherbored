import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import GetClaims from '../components/GetClaims'
import WalletInsights from '../components/WalletInsights'
import Image from 'next/image'
import AccountStats from '../components/AccountStats'

async function getSolBalance(walletPublicKey: PublicKey, solanaConnection: Connection) {
  return solanaConnection.getBalance(walletPublicKey);
}

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

  // console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);

  return accounts.map((account) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const balance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    //Log results
    // console.log(`Token Account: ${account.pubkey.toString()}`);
    // console.log(`--Token Mint: ${mintAddress}`);
    // console.log(`--Token Balance: ${balance}`);
    console.log('this the wallet page dawg')

    return { pubkey: account.pubkey.toString(), mintAddress, balance };
  });
}

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { tokenAccounts: [], solBalance: 0 } }
  }

  console.log('session', session.user.name)

  const walletPublicKey = session?.user ? new PublicKey(session.user.name) : new PublicKey('');
  const rpcEndpoint = 'https://flashy-newest-sponge.solana-mainnet.quiknode.pro/';


  const solanaConnection = new Connection(rpcEndpoint);
  const tokenAccounts = await getTokenAccounts(session.user.name, solanaConnection);
  const solBalance = await getSolBalance(walletPublicKey, solanaConnection);

  return {
    props: { tokenAccounts, solBalance },
  }

}

type Props = {
  tokenAccounts: any[],
  solBalance: number

}


function toSol(balance: number) {
  return balance / 10 ** 8;
}

const WalletPage: React.FC<Props> = (props) => {

  const BopTokenMint = props.tokenAccounts.filter(account => account.mintAddress === "BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3");
  const UsdcTokenMint = props.tokenAccounts.filter(account => account.mintAddress === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

  const { data: session } = useSession();

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
      <div className='px-12 text-xs'>

        {/* <WalletInsights user={session?.user} /> */}

        <div className='mt-8'>

          <div className="avatar mr-4">
            <div className="w-4 rounded-full mr-1">
              <img src="/logos/bop.webp" />
            </div>
            <p>$BOP: {BopTokenMint.reduce((acc, account) => acc + account.balance, 0)}</p>

          </div>
          <div className="avatar mr-4">
            <div className="w-4 rounded-full mr-1">
              <img src="/logos/sol.webp" />
            </div>
            <p>$SOL: {toSol(props.solBalance)}</p>

          </div>
          <div className="avatar">
            <div className="w-4 rounded-full mr-1">
              <img src="/logos/usdc.webp" />
            </div>
            <p>$USDC: {UsdcTokenMint.reduce((acc, account) => acc + account.balance, 0)}</p>

          </div>
        </div>




        {/* <SendSolanaSplTokens /> */}
        {/* <Prices /> */}
        <GetClaims amount={0} claimToken={''} />

        {/* <h1 className='text-2xl font-bold mb-12'>Wallet: {session.user.name}</h1> */}


        {/* we need to know the decimal places of the other tokens to convert 
            it to a human readable number. like we did with lamports for the 
            toSol function
            we also need to know the token name. we can get that from the mint address
            we can get the mint address from the token account
            we can get the token account from the wallet address
            we can get the wallet address from the session
            we can get the session from the useSession hook
            lol co-pilot comments 
         */}

        {/* <div className='p-2 mt-4'>
          {props.tokenAccounts.filter(account => account.mintAddress !== BopTokenMint[0].mintAddress && account.mintAddress !== UsdcTokenMint[0].mintAddress).map((account, index) => {
            let tokenName;
            let balance;
            if (BopTokenMint.length && account.mintAddress === BopTokenMint[0].mintAddress) {
              tokenName = "$BOP";
              balance = account.balance;
            } else if (UsdcTokenMint.length && account.mintAddress === UsdcTokenMint[0].mintAddress) {
              tokenName = "$USDC";
              balance = account.balance;
            } else {
              tokenName = "Some Shitcoin";
              balance = 0;
            }

            return (
              <div key={index}>
                <p>{tokenName}: {balance}</p>
              </div>
            );
          })}
        </div> */}

      </div>

    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default WalletPage
