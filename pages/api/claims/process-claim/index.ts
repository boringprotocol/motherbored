import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { TokenInstructions, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await useSession({ req });

  if (!session?.user?.email && !session?.user?.name) {
    return res.status(400).json({ error: "Wallet address not found" });
  }

  const walletAddress = session.user.email ?? session.user.name;
  const claimantPublicKey = walletAddress && new PublicKey(walletAddress);

  const bopMintAddress = process.env.BOP_MINT_ADDRESS;
  if (!bopMintAddress) {
    return res.status(400).json({ error: "BOP mint address not found" });
  }
  const tokenMintPublicKey = new PublicKey(bopMintAddress);

  const claim = await prisma.claim.findFirst({
    where: {
      user: {
        wallet: walletAddress,
      },
      claimed: false,
    },
  });

  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }

  const tokenAmount = claim.amount;

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    return res.status(400).json({ error: "Private key not found" });
  }

  const payerSecretKey = Uint8Array.from(JSON.parse(privateKey));
  const payerPublicKeyStr = process.env.PAYER_PUBLIC_KEY;
  if (!payerPublicKeyStr) {
    return res.status(400).json({ error: "Payer public key not found" });
  }
  const payerPublicKey = new PublicKey(payerPublicKeyStr);

  const payerKeypair = Keypair.fromSecretKey(payerSecretKey);

  const solanaEndpoint = process.env.SOLANA_ENDPOINT;
  if (!solanaEndpoint) {
    return res.status(400).json({ error: "Solana endpoint not found" });
  }
  const connection = new Connection(solanaEndpoint);

  const decimals = (
    await Token.getAssociatedTokenAddressInfo(
      claimantPublicKey,
      tokenMintPublicKey
    )
  ).decimals;

  const token = new Token(
    connection,
    tokenMintPublicKey,
    TOKEN_PROGRAM_ID,
    payerKeypair
  );

  const tokenAmountWithDecimals = token.toDecimal(tokenAmount, decimals);

  const destinationAddress = claimantPublicKey.toBuffer();
  const instruction = TokenInstructions.transfer(
    TOKEN_PROGRAM_ID,
    payerPublicKey,
    destinationAddress,
    tokenAmountWithDecimals
  );

  const transaction = new Transaction().add(instruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payerKeypair,
  ]);

  await prisma.claim.update({
    where: {
      id: claim.id,
    },

    data: {
      claimed: true,
    },
  });

  return res.status(200).json({ message: `Transaction ${signature} sent` });
}
