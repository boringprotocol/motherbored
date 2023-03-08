import { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
// import { Wallet } from "@solana/wallet-adapter-wallets";
// import { sendTransaction } from "../../utils/solana";
// import prisma from "../../utils/prisma";

async function handleClaim(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, amount, claimToken } = req.body;

  try {
    // Check that all required fields are present
    if (!walletAddress || !amount || !claimToken) {
      return res
        .status(400)
        .json({ error: "Invalid claim request: missing required fields" });
    }

    // Verify the claim token against the database
    const claim = await prisma.claim.findUnique({
      where: {
        claimTokenHash: createHash("sha256").update(claimToken).digest("hex"),
      },
    });
    if (
      !claim ||
      claim.isClaimed ||
      claim.amount !== amount ||
      claim.walletAddress !== walletAddress
    ) {
      return res.status(400).json({
        error:
          "Invalid claim request: claim token is not valid or has already been used",
      });
    }

    // Get the wallet containing the BOP tokens
    const wallet = new Wallet({
      publicKey: process.env.SENDER_PUBLIC_KEY,
      signAllTransactions: async (transaction) => {
        transaction.partialSign(await wallet.sign(transaction));
        return transaction;
      },
    });

    let txid;
    let retries = 0;
    const maxRetries = 3;

    // Retry sending the transaction up to `maxRetries` times
    while (retries < maxRetries) {
      try {
        // Send the transaction to transfer the BOP tokens to the user's wallet address
        txid = await sendTransaction(
          wallet,
          [
            {
              pubkey: new Wallet(walletAddress).publicKey,
              isSigner: false,
              isWritable: true,
            },
          ],
          amount
        );

        // If the transaction was successful, update the database to mark the claim as processed
        await prisma.claim.update({
          where: { id: claim.id },
          data: { isClaimed: true },
        });

        return res.status(200).json({ success: true, txid });
      } catch (err) {
        // If the transaction failed, log the error and retry
        console.error(`Transaction failed with error: ${err.message}`);
        retries++;
      }
    }

    // If all retries fail, return an error response
    return res
      .status(500)
      .json({ error: "Failed to process claim after maximum retries" });
  } catch (err) {
    // If an error occurs during claim processing, return a 500 Internal Server Error
    console.error(`Error processing claim: ${err.message}`);
    return res.status(500).json({ error: "Failed to process claim" });
  }
}

export default handleClaim;
