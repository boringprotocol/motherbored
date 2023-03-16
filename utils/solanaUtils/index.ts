// utils/solanaUtils/index.ts
// this is the file that contains the transferBop function which will be called from the process-claim/index.ts file. it is responsible for sending the BOP tokens to the user's wallet address. it is also responsible for updating the database to mark the claim as processed.

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import BN from "bn.js";
import dotenv from "dotenv";

dotenv.config();

interface TransferParams {
  connection: Connection;
  payerWalletPublicKey: string;
  recipientWalletPublicKey: string;
  amount: number;
  payerPrivateKey?: string;
}

// key is all fucked up.
function isValidPrivateKey(privateKey: string): boolean {
  const privateKeyRegex = /^[0-9a-fA-F]{64}$/;
  return privateKeyRegex.test(privateKey);
}

export async function transferBop({
  connection,
  payerWalletPublicKey,
  recipientWalletPublicKey,
  amount,
  payerPrivateKey,
}: TransferParams): Promise<string> {
  console.log("Private key:", payerPrivateKey); // Temporary log for debugging purposes

  if (!payerPrivateKey || !isValidPrivateKey(payerPrivateKey)) {
    throw new Error("Invalid payer private key.");
  }

  const payerAccount = payerPrivateKey
    ? Keypair.fromSecretKey(new Uint8Array(Buffer.from(payerPrivateKey, "hex")))
    : undefined;

  if (!payerAccount) {
    throw new Error("Payer private key is required for the transfer.");
  }

  const payerPublicKey = new PublicKey(payerWalletPublicKey);
  const recipientPublicKey = new PublicKey(recipientWalletPublicKey);
  const bopTokenMintAddress = new PublicKey(
    process.env.BOP_TOKEN_ACCOUNT_ADDRESS!
  );

  const sourceTokenAccount = new PublicKey(
    process.env.PAYER_WALLET_PUBLIC_KEY!
  );

  const transferInstruction = new TransactionInstruction({
    keys: [
      { pubkey: sourceTokenAccount, isSigner: false, isWritable: true },
      { pubkey: recipientPublicKey, isSigner: false, isWritable: true },
      { pubkey: bopTokenMintAddress, isSigner: false, isWritable: false },
      { pubkey: payerPublicKey, isSigner: true, isWritable: false },
    ],
    programId: TOKEN_PROGRAM_ID,
    data: Buffer.from([1, ...new BN(amount).toArray("le", 8)]),
  });

  const transaction = new Transaction().add(transferInstruction);
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payerAccount],
    {
      commitment: "singleGossip",
    }
  );

  return signature;
}
