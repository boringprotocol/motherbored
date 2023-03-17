import {
  Connection,
  PublicKey,
  Keypair,
  SignatureResult,
  Context,
} from "@solana/web3.js";
import { transfer } from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();

export interface TransferParams {
  connection: Connection;
  sourceTokenAccount: PublicKey;
  destinationWalletPublicKey: PublicKey;
  destinationTokenAccount: PublicKey;
  amount: number;
  payerPrivateKey: Uint8Array;
  tokenMintAddress: PublicKey;
  sourceWalletOwnerPublicKey: PublicKey;
}

export const transferBop = async ({
  connection,
  sourceTokenAccount,
  destinationTokenAccount,
  amount,
  payerPrivateKey,
  sourceWalletOwnerPublicKey,
}: TransferParams): Promise<string> => {
  const payerAccount = Keypair.fromSecretKey(payerPrivateKey);

  const signature = await transfer(
    connection,
    payerAccount,
    sourceTokenAccount,
    destinationTokenAccount,
    sourceWalletOwnerPublicKey,
    amount,
    [],
    { commitment: "confirmed" }
  );

  connection.onSignature(signature, onSignature, "confirmed");

  return signature;
};

const onSignature = (signatureResult: SignatureResult, context: Context) => {
  console.log("Transaction status update:", signatureResult, context);
};
