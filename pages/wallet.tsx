import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useState } from 'react'

const rpcEndpoint = 'https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/';
const solanaConnection = new Connection(rpcEndpoint);
const walletToQuery = '4yP4qkG3aBRZHSsdmb1fjrrTt7n9CQSTkaynbkzPF75D';


const Home = ({accounts, tokenNames}) => {
  return (
    <div>
      <h1> Token Accounts </h1>
        {accounts.map((account, i) => {
            const parsedAccountInfo:any = account.account.data;
            const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
            const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
            const tokenName = tokenNames[i];
            return (
              <div key={i}>
                <p> Token Account No. {i + 1}: {account.pubkey.toString()} </p>
                <p> Token Mint: {mintAddress}, Token Name: {tokenName}</p>
                <p> Token Balance: {tokenBalance} </p>
              </div>
            )
        })}
    </div>
  );
}

Home.getInitialProps = async () => {
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: [
      {dataSize: 165},
      {memcmp: {offset: 32, bytes: walletToQuery}}
    ]}
  )
  console.log(`Found ${accounts.length} token account(s) for wallet ${walletToQuery}.`);
  
  const tokenNames = await Promise.all(
    accounts.map(async (account) => {
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const mintAccountInfo = await solanaConnection.getParsedAccountInfo(mintAddress)
        return mintAccountInfo.parsed.info.name
    })
  )
  return { accounts, tokenNames }
}

export default Home
