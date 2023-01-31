import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
// import fetch from 'node-fetch';
// import { CreateFalconSetupkey, GetFalconToken } from "../../../lib/falcon";

import sleep from 'sleep-promise';

// POST /api/peer
export default async function handle(req: any, res: any) {
    const { name, label, kind, target, provider_kind, consumer_platform, provider_platform, wifi_preference, channel, ssid, wpa_passphrase, country_code } = req.body;
    const session = await getSession({ req });
    if (!session || !session.user?.name) {
        res.statusCode = 403;
        return;
    }

    let pk = provider_kind
    if (kind=="consumer"){
        pk=null
    }
    
    let pp = provider_platform
    if (kind=="consumer"){
        pp=null
    }

    let cp = consumer_platform
    if (kind=="provider"){
        cp=null
    }
    
    // convert channel to Int
    let channelint = 7
        if (channel != null) {
            channelint = parseInt(channel);
        }

    const result = await prisma.peer.create({
        data: {
            name: name,
            label: label,
            kind: kind,
            target: target,
            provider_kind: pk,
            consumer_platform: cp,
            provider_platform: pp,
            wifi_preference: wifi_preference,
            channel: channelint,
            ssid: ssid,
            wpa_passphrase: wpa_passphrase,
            country_code: country_code,

            User: { connect: { wallet: session.user.name } }
        },
    });

    // Instead of a Falcon setup key, we just return the ID of the created peer
    res.statusCode = 200;
    return res.json({ id: result.id });
}
    // when the falcon API is ready, uncomment this

    // let accesstoken = await GetFalconToken();
    // await sleep(1000);
    // if (!accesstoken) {
    //     res.statusCode = 500;
    //     return
    // }

    // if (kind == "provider") {
    //     let wtf = await CreateFalconSetupkey(result.id, result.id, accesstoken)
    //     res.statusCode = 200;
    //     return res.json(wtf);
    // } else if (kind == "consumer") {
    //     let wtf = await CreateFalconSetupkey(result.id, target, accesstoken)
    //     res.statusCode = 200;
    //     return res.json(wtf);
    // }

