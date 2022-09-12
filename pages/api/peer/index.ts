import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// POST /api/peer
export default async function handle(req, res) {
    const { name, setupkey, kind } = req.body;
    const session = await getSession({ req });
    if (!session || !session.user?.name) {
        res.statusCode = 403;
        return { props: { peers: [] } };
    }

    const result = await prisma.peer.create({
        data: {
            name: name,
            setupkey: setupkey,
            kind: kind,
            User: { connect: { wallet: session.user?.name } }
        },
    });
    res.json(result);
}