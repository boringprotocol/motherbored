import { getSession } from "next-auth/react";
import { GetStatsForPubkey } from "../../../lib/influx";
import prisma from "../../../lib/prisma";

// GET /api/stats
export default async function handle(req: any, res: any) {
    const pubkey = req.query.pubkey
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 403;
        return "session invalid"
    }
    try {
        //    const statsResult = await GetStatsForPubkey("LrTPUkTIv5J5gaBBY2vsyWiD90qQlhGfDYN7iIveXEg=");
        const statsResult = await GetStatsForPubkey(pubkey);
        res.statusCode = 200;
        res.json(statsResult);
    } catch {
        res.status(500).json("error")
    }

}