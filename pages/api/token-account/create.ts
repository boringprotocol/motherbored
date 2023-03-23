// api/token-account/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findAssociatedTokenAddress } from "../../../utils/solanaUtils";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

async function handleCreateTokenAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { walletAddress, tokenMintAddress } = req.body;

  try {
    const associatedTokenAddress = await findAssociatedTokenAddress(
      new PublicKey(walletAddress),
      new PublicKey(tokenMintAddress)
    );

    // If the associated token account already exists, return success
    if (associatedTokenAddress) {
      return res.status(200).json({ success: true });
    }

    // Create the associated token account
    const transaction = new Transaction().add(
      await createAssociatedTokenAccountInstruction(
        new PublicKey(walletAddress),
        new PublicKey(tokenMintAddress)
      )
    );

    const connection = new Connection(
      process.env.SOLANA_ENDPOINT!,
      "confirmed"
    );
    const payerWalletPublicKey = process.env.PAYER_WALLET_PUBLIC_KEY!;
    const payerPrivateKey = base58ToUint8Array(
      process.env.PAYER_WALLET_PRIVATE_KEY!
    );

    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.feePayer = new PublicKey(payerWalletPublicKey);

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [new Account(payerPrivateKey)],
      { skipPreflight: false, commitment: "confirmed" }
    );

    console.log(`Signature: ${signature}`);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(
      `Error creating associated token account: ${(err as Error).message}`
    );
    return res
      .status(500)
      .json({ error: "Failed to create associated token account" });
  }
}

export default handleCreateTokenAccount;

async function createAssociatedTokenAccountInstruction(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<TransactionInstruction> {
  const associatedTokenAddress = await findAssociatedTokenAddress(
    walletAddress,
    tokenMintAddress
  );

  if (associatedTokenAddress) {
    throw new Error("Associated token account already exists");
  }

  const systemProgramId = new PublicKey("11111111111111111111111111111111");

  const associatedTokenAccountPublicKey = await getOrCreateAccount(
    walletAddress,
    tokenMintAddress
  );

  const createAssociatedTokenAccountIx =
    Token.createAssociatedTokenAccountInstruction(
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      associatedTokenAccountPublicKey,
      walletAddress,
      walletAddress
    );

  return createAssociatedTokenAccountIx;
}
