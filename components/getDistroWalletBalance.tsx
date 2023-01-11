import { Connection } from '@solana/web3.js'

const SolanaBalance = ({ walletAddress, tokenTicker }) => {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const connection = new Connection('https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/')
    const programId = 'BOP'

    connection.getAccountInfo(walletAddress).then(async info => {
      const accountInfo = await connection.getAccountInfo(walletAddress, {
        useInstance: programId
      });
      if (!accountInfo.lamports) {
        return setBalance(0);
      }
      setBalance(accountInfo.lamports / 1000000);
    });
  }, [walletAddress, tokenTicker])

  return (
    <>
      {balance === null ? (
        <p>Loading balance...</p>
      ) : (
        <p>{tokenTicker} balance: {balance}</p>
      )}
    </>
  )
}

export default SolanaBalance
