// page/api/activity/[id].ts
import { getSession } from "next-auth/react";
import { FalconGetPeers, GetFalconToken } from "../../../lib/falcon";
import prisma from "../../../lib/prisma";

// PUT /api/activate/:id
// Activate a provider peer that is currently inactive
export default async function handle(req: any, res: any) {
  const peerId = req.query.id;
  const { name } = req.query;
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return "session invalid";
  }

  const peer = await prisma.peer.findUnique({
    where: {
      id: String(peerId),
    },
  });

  if (peer == null) {
    res.statusCode = 404;
    return "peer not found";
  }

  if (peer.pubkey != null) {
    res.statusCode = 200;
    return "already active";
  }

  const accesstoken = await GetFalconToken();
  console.log(accesstoken);

  if (accesstoken == null || accesstoken == "") {
    console.log("it is going in");
    res.statusCode = 500;
    res.json({ thing: "fran was here" });
    return "could not get accesstoken";
  }

  if (peer.kind == "provider") {
    const result = await FalconGetPeers(peerId, accesstoken);
    if (result) {
      res.json(peer);
      res.statusCode = 200;
    } else {
      // inactive, motherbored not booted or no peers
      res.statusCode = 400;
      res.json({
        error: "motherbored not booted yet, download config and try again",
      });
    }
    return peerId;
  } else {
    // not a provider
    res.statusCode = 400;
    return "not a provider";
  }
}
