import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// PUT /api/peer/:id
export default async function handle(req: any, res: any) {
    const peerId = req.query.id;
    const { name } = req.query
    const session = await getSession({ req });
    if (!session) {
        return
    }
    const peer = await prisma.peer.update({
        where: { id: peerId },
        data: {
            name: name,
        },
    });
    res.json(peer);
}