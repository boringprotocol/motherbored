import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { IoEyedrop, IoWaterOutline } from 'react-icons/io5'
import DateRangePicker from 'components/DateRangePicker'

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

  console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);

  return accounts.map((account) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const balance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    //Log results
    console.log(`Token Account: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${balance}`);

    return { pubkey: account.pubkey.toString(), mintAddress, balance };
  });
}

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { tokenAccounts: [], solBalance: 0 } }
  }

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
      <div className="px-12 text-xs">
        <h1 className="pt-12 text-2xl font-semibold">
          <span className="float-left mr-2">
            <IoWaterOutline />
          </span>
          aird.rip
        </h1>
        <h2 className='text-xs text-gray-500'>from Boring Protocol</h2>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="prose">
            <h2 className="text-xl font-bold mb-2">Build A Drip</h2>
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt recusandae aperiam sed quae inventore blanditiis.
            </p>

            <p className="text-gray-500">354 node providers will be added to your drip</p>

            <label className="block mt-4">
              <span className="font-semibold">Name:</span>
              <input type="text" placeholder="Enter name" className="input input-bordered w-full mt-1 max-w-xs" />
            </label>

            <label className="block mt-4">
              <span className="font-semibold">Description:</span>
              <textarea className="textarea textarea-bordered mt-1" placeholder="Enter description"></textarea>
            </label>

            <label className="block mt-4">
              <span className="font-semibold">Token Mint Address:</span>
              <input type="text" placeholder="Enter token mint address" className="input input-bordered w-full mt-1 max-w-xs" />
            </label>

            <label className="block mt-4">
              <span className="font-semibold">Date Range:</span>
              <fieldset className="border border-base-200 p-4 mt-1">
                <DateRangePicker />
              </fieldset>
            </label>

            <label className="block mt-4">
              <span className="font-semibold">File:</span>
              <div className="mt-1">
                <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
              </div>
            </label>
            <button className="btn btn-outline mt-4">Create Drip</button>
          </div>
          <div className="">
            <h1 className="text-xl font-bold mb-2">Your Drips</h1>
            <p className="text-xs">Some drip</p>
            <p className="text-xs">Your drip is under review. check back for further instructions</p>
            <p className="text-xs">
              Your drip is approved, send x sol and x token to 9374k5o7346c5w37864j53784j6578364k58
            </p>

            {/* <h2 className="text-xl font-bold mb-2 mt-8">Upcoming</h2>
            <ol className="list-disc pl-5">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ol>
            <h2 className="text-xl font-bold mb-2 mt-8">Past</h2>
            <ol className="list-disc pl-5">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ol> */}
          </div>
        </div>
      </div>


    </LayoutAuthenticated>
  );
}

export { getServerSideProps }

export default WalletPage
