// api/claims/process-claim/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { transferBop } from "../../../../utils/solanaUtils";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

function base58ToUint8Array(base58String: string): Uint8Array {
  return new Uint8Array(bs58.decode(base58String));
}

const prisma = new PrismaClient();

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

async function handleClaim(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.body;

  try {
    const claim = await prisma.claim.findFirst({
      where: {
        wallet: walletAddress,
        claimed: false,
      },
    });

    if (!claim) {
      return res.status(400).json({
        error: "Invalid claim request: claim not found",
      });
    }

    const connection = new Connection(
      process.env.SOLANA_ENDPOINT!,
      "confirmed"
    );

    const payerWalletPublicKey = process.env.PAYER_WALLET_PUBLIC_KEY!;
    const recipientWalletPublicKey = walletAddress;
    const payerPrivateKey = base58ToUint8Array(
      process.env.PAYER_WALLET_PRIVATE_KEY!
    );

    const tokenMintAddress = new PublicKey(
      process.env.BOP_TOKEN_ACCOUNT_ADDRESS!
    );

    const sourceTokenAccount = await findAssociatedTokenAddress(
      new PublicKey(payerWalletPublicKey),
      tokenMintAddress
    );
    const destinationTokenAccount = await findAssociatedTokenAddress(
      new PublicKey(recipientWalletPublicKey),
      tokenMintAddress
    );

    const amount = claim.amount; // Assuming the amount is stored in the claim object
    const decimalFactor = 100000000; // 10^8
    const adjustedAmount = amount * decimalFactor;

    const sourceWalletOwnerPublicKey = new PublicKey(payerWalletPublicKey);

    const signature = await transferBop({
      connection,
      sourceTokenAccount,
      destinationWalletPublicKey: new PublicKey(recipientWalletPublicKey),
      destinationTokenAccount,
      amount: adjustedAmount, // Use the adjusted amount here
      payerPrivateKey,
      tokenMintAddress,
      sourceWalletOwnerPublicKey,
    });

    await prisma.claim.update({
      where: {
        id: claim.id,
      },
      data: { claimed: true, signature: signature },
    });

    return res.status(200).json({ success: true, signature });
  } catch (err: any) {
    console.error(`Error processing claim: ${(err as Error).message}`);
    return res.status(500).json({ error: "Failed to process claim" });
  }
}

export default handleClaim;
