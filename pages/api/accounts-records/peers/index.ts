import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const users = await prisma.user.findMany({
      include: {
        accountHistory: true,
        peers: true,
      },
    });

    console.log("Updating account history...");

    const timestamp = new Date();
    for (const user of users) {
      const { id, accountHistory } = user;
      let providerLocalCount = 0;
      let providerCloudCount = 0;
      let consumerPiCount = 0;
      let consumerLinusCount = 0;
      let consumerWindowsCount = 0;
      let consumerMacCount = 0;
      for (const peer of user.peers) {
        if (peer.provider_kind === "local") {
          providerLocalCount++;
        } else if (peer.provider_kind === "cloud") {
          providerCloudCount++;
        }
        if (peer.consumer_platform === "pi") {
          consumerPiCount++;
        } else if (peer.consumer_platform === "linux") {
          consumerLinusCount++;
        } else if (peer.consumer_platform === "windows") {
          consumerWindowsCount++;
        } else if (peer.consumer_platform === "mac") {
          consumerMacCount++;
        }
      }
      const data = {
        accountId: id,
        timestamp,
        provider_local: providerLocalCount || 0,
        provider_cloud: providerCloudCount || 0,
        consumer_local: consumerPiCount || 0,
        consumer_linux: consumerLinusCount || 0,
        consumer_windows: consumerWindowsCount || 0,
        consumer_mac: consumerMacCount || 0,

        // We set these values to 0 because we don't have this data yet.
        // This data will be added in the next step on the accounts-records page.
        v1_license: 0,
        v2_license: 0,
        vx_license: 0,
        soft_stake: 0,
        poa: 0,
        snapshot: req.body.snapshot,
        wallet: user.wallet,
      };

      const newAccountHistory = await prisma.accountHistory.create({
        data,
      });
      accountHistory.push(newAccountHistory);
    }
    res.status(200).json({ message: "Account history updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating account history." });
  }
}
