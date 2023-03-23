import { PublicKey, Connection, SystemProgram, Keypair, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

const createAccount = async () => {
  const from = Keypair.generate();
  const to = Keypair.generate();
  const amount = 1000000;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: amount,
    })
  );

  await sendAndConfirmTransaction(connection, transaction, [from, to]);

  console.log('Success');
}
