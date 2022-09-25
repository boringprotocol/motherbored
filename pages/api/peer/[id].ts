import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"

// PUT /api/peer/:id
// DELETE /api/post/:id
export default async function handle(req: any, res: any) {
    if (req.method === "PUT") {
        const peerId = req.body.id;
        const { name, label, ssid, country_code, wifi_preference, wpa_passphrase, target } = req.body
        const session = await getSession({ req });
        if (!session) {
            return
        }
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
            },
        });
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

