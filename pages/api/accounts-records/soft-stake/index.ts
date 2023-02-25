import { NextApiRequest, NextApiResponse } from "next";
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Handling update-account-history-soft-stake request...");

  try {
    const { snapshot } = req.body;
    await updateAccountHistorySoftStake(snapshot);
    console.log("updateAccountHistorySoftStake called with snapshot", snapshot);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getWallets(): Promise<string[]> {
  const accountHistories = await prisma.accountHistory.findMany({
    where: {
      snapshot: "silly-susan",
      wallet: {
        not: null,
      },
    },
    select: {
      wallet: true,
      account: {
        select: {
          wallet: true,
        },
      },
    },
  });

  return accountHistories.map((history) => history.account.wallet) as string[];
}

const rpcEndpoint = "https://flashy-newest-sponge.solana-mainnet.quiknode.pro/";
const connection = new Connection(rpcEndpoint);

const MINT_TO_SEARCH = "BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3"; //BOP Mint Address

async function getTokenAccounts(
  wallets: { id: number; wallet: string }[],
  connection: Connection
) {
  for (const { id, wallet } of wallets) {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: wallet, //our search criteria, a base58 encoded string
        },
      },
      // Add this search parameter
      {
        memcmp: {
          offset: 0, //number of bytes
          bytes: MINT_TO_SEARCH, //base58 encoded string
        },
      },
    ];

    try {
      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        { filters: filters }
      );

      console.log(
        `Found ${accounts.length} token account(s) for wallet ${wallet}.`
      );

      const accountHistoryUpdatePromises = accounts.map((account) => {
        // Parse the account data
        const parsedAccountInfo: any = account.account.data;
        const balance: number =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

        return prisma.accountHistory.update({
          where: { id: String(id) },
          data: {
            soft_stake: balance,
          },
        });
      });

      await prisma.$transaction(accountHistoryUpdatePromises);
    } catch (error) {
      console.log(`Error fetching token accounts for wallet ${wallet}:`, error);
    }
  }
}

async function updateAccountHistorySoftStake(snapshot: string) {
  try {
    const wallets = await getWallets();
    for (const wallet of wallets) {
      console.log(`Processing wallet ${wallet}...`);
      const filters: GetProgramAccountsFilter[] = [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 32,
            bytes: wallet,
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: MINT_TO_SEARCH,
          },
        },
      ];
      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        { filters: filters }
      );
      console.log(
        `Found ${accounts.length} token account(s) for wallet ${wallet}.`
      );
      for (const account of accounts) {
        const parsedAccountInfo: any = account.account.data;
        const balance: number =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        const accountHistory = await prisma.accountHistory.findFirst({
          where: {
            account: {
              wallet: wallet,
            },
            snapshot: snapshot,
          },
        });
        if (!accountHistory) {
          console.log(
            `Could not find account history for wallet ${wallet}. Skipping.`
          );
          continue;
        }
        console.log(
          `Updating account history record with id ${accountHistory.id}...`
        );
        await prisma.accountHistory.update({
          where: { id: String(accountHistory.id) },
          data: {
            soft_stake: balance,
          },
        });
        console.log(
          `Account history record with id ${accountHistory.id} updated.`
        );
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
