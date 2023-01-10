import Quicknode from 'quicknode-solana';
import mintList from './mintList.json';

const contractAddress = mintList[0].contractAddress;

// Connect to the Solana network
const client = new Quicknode('https://fluent-dimensional-shadow.solana-mainnet.quiknode.pro/');

// Get the list of NFT holders
client.getHolders(contractAddress).then((holders: string[]) => {
  console.log(holders);
});
