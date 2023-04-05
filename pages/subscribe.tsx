import { TransactionInstruction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';
import { createTransferCheckedInstruction } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Connection } from '@solana/web3.js';

const endpoint = "https://flashy-newest-sponge.solana-mainnet.quiknode.pro/";
const memo = "My transaction memo";

const SubscribePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubscribe = (amount: number) => async () => {
    if (!publicKey || !session?.user?.name) {
      return;
    }

    const destinationAddress = process.env.NEXT_PUBLIC_DESTINATION_WALLET_ADDRESS ?? 'default address';
    const destination = new PublicKey(destinationAddress);
    const decimals = 6;
    const lamports = Math.round(amount * 10 ** decimals);

    const connection = new Connection(endpoint, 'confirmed');

    // Step 1: Create transaction
    const fromPublicKey = new PublicKey(session.user.name);
    const mintAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const transaction = new Transaction();
    const instruction = createTransferCheckedInstruction(
      fromPublicKey,
      mintAddress,
      destination,
      publicKey,
      lamports,
      decimals,
    );
    transaction.add(instruction);

    // Step 2: Add a memo to the transaction
    const memoInstruction = new TransactionInstruction({
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      keys: [],
      data: Buffer.from(memo),
    });

    transaction.add(memoInstruction);

    try {
      // Step 3: Sign and send the transaction
      const signature = await sendTransaction(transaction, connection, {
        signers: [],
      });

      console.log(`Transaction sent with signature: ${signature}`);
    } catch (error) {
      console.error(error.message);
      alert(`Unable to simulate transaction: ${error.message}`);
    }
  };

  console.log("session", session);
  console.log("publicKey", publicKey);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  console.log("user name", session.user.name);

  return (
    <div>
      <h1>Subscribe to Motherbored - {session?.user?.name}</h1>
      <p>Choose a subscription:</p>
      <button onClick={handleSubscribe(1)}>Basic ($1/month)</button>
      <button onClick={handleSubscribe(10)}>Pro ($10/month)</button>
      <button onClick={handleSubscribe(25)}>Premium ($25/month)</button>
      <button onClick={handleSubscribe(50)}>Elite ($50/month)</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default SubscribePage;
