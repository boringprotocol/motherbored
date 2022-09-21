import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"

// PUT /api/peer/:id
export default async function handle(req: any, res: any) {
    const peerId = req.body.id;
    const { name, label, ssid } = req.body
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
        },
    });
    res.json(peer);
}
