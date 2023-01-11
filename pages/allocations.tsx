import { useState, useEffect } from 'react';
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const wallet = "oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V";

export default function TokenPage() {
  const [error, setError] = useState<Error | null>(null);
  const [tokenAccounts, setTokenAccounts] = useState([]);

  useEffect(() => {
    async function allocations() {
      try {
        const solana = new Connection(
          'https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/'
        );
        const filters: GetProgramAccountsFilter[] = [
          {
            dataSize: 165,    //size of account (bytes)
          },
          {
            memcmp: {
              offset: 32,     //location of our query in the account (bytes)
              bytes: wallet,  //our search criteria, a base58 encoded string
            }
          }
        ]
        const tokenAccounts = await solana.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID,
          { filters }
        );
        setTokenAccounts(tokenAccounts);
      } catch (err) {
        setError(err);
        console.error(err);
      }
    }
    allocations();
  }, []);

  return (
    <div>
      <h1>Token Accounts</h1>
      <div id="token-accounts">
<ul>
{tokenAccounts.map((account, i) => {
return (
<li key={i}>
parsed: {account.parsed}
<br />
program: {account.program}
<br />
space: {account.space}
</li>
);
})}
</ul>
</div>
{error ? <p>Error: {error.message}</p> : <p>Loading...</p> }
</div>
);
}
