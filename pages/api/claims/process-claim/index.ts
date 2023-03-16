// pages/api/claims/process-claim
// this is the file that will be called when the user clicks the "Claim" button on the frontend.
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { transferBop } from "../../../../utils/solanaUtils";
import { Connection } from "@solana/web3.js";

const prisma = new PrismaClient();

async function handleClaim(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, amount } = req.body;

  console.log("req.body: ", req.body);
  console.log("wallet: ", walletAddress);

  try {
    // Verify the claim against the database
    const claim = await prisma.claim.findFirst({
      where: {
        wallet: walletAddress,
        claimed: false,
      },
    });

    console.log("claim:", claim);

    if (!claim) {
      return res.status(400).json({
        error: "Invalid claim request: claim not found",
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC_HOST!,
      "confirmed"
    );

    const payerWalletPublicKey = process.env.PAYER_WALLET_PUBLIC_KEY!;
    const recipientWalletPublicKey = walletAddress;
    const payerPrivateKey = process.env.PAYER_WALLET_PRIVATE_KEY!;

    // Send the BOP tokens to the user's wallet address
    console.log(
      "PAYER_WALLET_PRIVATE_KEY in handleClaim:",
      process.env.PAYER_WALLET_PRIVATE_KEY
    );

    const signature = await transferBop({
      connection,
      payerWalletPublicKey,
      recipientWalletPublicKey,
      amount: claim.amount, // Use the amount from the claim object
      payerPrivateKey,
    });

    // If the transaction was successful, update the database to mark the claim as processed
    await prisma.claim.update({
      where: {
        id: claim.id,
      },
      data: { claimed: true },
    });

    return res.status(200).json({ success: true, signature });
  } catch (err: any) {
    console.error(`Error processing claim: ${(err as Error).message}`);
    return res.status(500).json({ error: "Failed to process claim" });
  }
}

export default handleClaim;
