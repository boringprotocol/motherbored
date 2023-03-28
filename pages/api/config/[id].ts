import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// GET /api/config/:id
// Download config file for peer
export default async function handle(req: any, res: any) {
  const peerId = req.query.id;
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

  let fileContents = "";
  if (peer.kind == "provider") {
    fileContents += "KIND=provider\n";
    fileContents += "SETUP_KEY=";
    fileContents += peer.setupkey;
    fileContents += "\n";
    fileContents += "BORING_NAME=";
    fileContents += peer.name;
    fileContents += "\n";
    fileContents += "BORING_ID=";
    fileContents += peer.id;
    fileContents += "\n";
    fileContents += "UPDATE=true";
    fileContents += "\n";

    fileContents += "WPA_PASSPHRASE=";
    fileContents += peer.wpa_passphrase;
    fileContents += "\n";

    fileContents += "SSID=";
    fileContents += peer.ssid;
    fileContents += "\n";

    fileContents += "WIFI_PREFERENCE=";
    fileContents += peer.wifi_preference;
    fileContents += "\n";

    fileContents += "COUNTRY_CODE=";
    fileContents += peer.country_code;
    fileContents += "\n";

    fileContents += "CHANNEL=";
    fileContents += peer.channel;
    fileContents += "\n";
  } else {
    //consumer
    const targetPeer = await prisma.peer.findUnique({
      where: {
        id: String(peer.target),
      },
    });

    fileContents += "KIND=consumer\n";
    fileContents += "SETUP_KEY=";
    fileContents += peer.setupkey;
    fileContents += "\n";
    fileContents +=
      "PUBLIC_PEER_IP_LIST=18.118.130.170,3.144.33.182,161.97.106.86,135.181.254.167,44.195.86.2\n";
    fileContents += "PROVIDER_PUBKEY=";
    fileContents += targetPeer?.pubkey;
    fileContents += "\n";
    fileContents += "BORING_NAME=";
    fileContents += peer.name;
    fileContents += "\n";
    fileContents += "BORING_ID=";
    fileContents += peer.id;
    fileContents += "\n";
    fileContents += "UPDATE=true";
    fileContents += "\n";

    fileContents += "WPA_PASSPHRASE=";
    fileContents += peer.wpa_passphrase;
    fileContents += "\n";

    fileContents += "SSID=";
    fileContents += peer.ssid;
    fileContents += "\n";

    fileContents += "WIFI_PREFERENCE=";
    fileContents += peer.wifi_preference;
    fileContents += "\n";

    fileContents += "COUNTRY_CODE=";
    fileContents += peer.country_code;
    fileContents += "\n";

    fileContents += "CHANNEL=";
    fileContents += peer.channel;
    fileContents += "\n";
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-disposition", 'filename="boring.env"');
  res.end(fileContents);
}
