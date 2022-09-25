import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"
import { CreateFalconSetupkey, GetFalconToken } from "../../../lib/falcon";
import sleep from 'sleep-promise';
import { channel } from "diagnostics_channel";

// PUT /api/peer/:id
// DELETE /api/post/:id
export default async function handle(req: any, res: any) {
    if (req.method === "PUT") {
        const peerId = req.body.id;
        const { name, label, ssid, country_code, wifi_preference, wpa_passphrase, target, channel } = req.body
        const session = await getSession({ req });
        if (!session) {
            return
        }
        // convert channel to Int
        let channelint = 7
        if (channel != null) {
            channelint = parseInt(channel);
        }
        // Save the updates
        const peer = await prisma.peer.update({
            where: { id: peerId },
            data: {
                name: name,
                label: label,
                ssid: ssid,
                country_code: country_code,
                wifi_preference: wifi_preference,
                wpa_passphrase: wpa_passphrase,
                target: target,
                channel: channelint,
            },
        });

        // Grab a new falcon key (TODO: don't do this everytime?)
        if (peer.kind == "consumer") {
            let accesstoken = await GetFalconToken();
            await sleep(1000);
            if (!accesstoken) {
                res.statusCode = 500;
                return
            } else {
                let wtf = await CreateFalconSetupkey(peer.id, target, accesstoken)
                res.statusCode = 200;
                return res.json(wtf);
            }
        }
        res.json(peer);
    } else if (req.method === "DELETE") {
        const peerId = req.query.id;
        const peer = await prisma.peer.delete({
            where: { id: peerId },
        });
        console.log(peer)
        res.json(peer)
    }

}

