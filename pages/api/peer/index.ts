import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import fetch from 'node-fetch';
import { CreateFalconSetupkey, GetFalconToken } from "../../../lib/falcon";

import sleep from 'sleep-promise';

// POST /api/peer
export default async function handle(req: any, res: any) {
    const { name, kind, target, provider_kind } = req.body;
    const session = await getSession({ req });
    if (!session || !session.user?.name) {
        res.statusCode = 403;
        return { props: { peers: [] } };
    }

    console.log(target)

    const result = await prisma.peer.create({
        data: {
            name: name,
            kind: kind,
            target: target,
            provider_kind: provider_kind,
            User: { connect: { wallet: session.user.name } }
        },
    });

    let accesstoken = await GetFalconToken();
    await sleep(1000);
    if (!accesstoken) {
        res.statusCode = 500;
        return
    }

    if (kind == "provider") {
        let wtf = await CreateFalconSetupkey(result.id, result.id, accesstoken)
        res.statusCode = 200;
        return res.json(wtf);
    } else if (kind == "consumer") {
        let wtf = await CreateFalconSetupkey(result.id, target, accesstoken)
        res.statusCode = 200;
        return res.json(wtf);
    }
}
