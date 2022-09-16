import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// PUT /api/activate/:id
// Activate a provider peer that is currently inactive
export default async function handle(req: any, res: any) {

    const peerId = req.query.id;
    const { name } = req.query
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 403;
        return "session invalid"
    }

    const peer = await prisma.peer.findUnique({
        where: {
            id: String(peerId),
        },
    });

    if (peer == null) {
        res.statusCode = 404;
        return "peer not found"
    }

    if (peer.pubkey != null) {
        res.statusCode = 200;
        return "already active"
    }

    // todo, fetch this token if expired
    const accesstoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkpZc01hcUxFUzMtRElTdDdwdE5KeSJ9.eyJpc3MiOiJodHRwczovL2Rldi03NjEyLXRiZC51cy5hdXRoMC5jb20vIiwic3ViIjoibEFUQ21lMTlnNHU2ZDdCVExJMXFkdDIyUmVWV2JpUnJAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYm9yaW5nIiwiaWF0IjoxNjYzMTA3NTIyLCJleHAiOjE2NjMxOTM5MjIsImF6cCI6ImxBVENtZTE5ZzR1NmQ3QlRMSTFxZHQyMlJlVldiaVJyIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.HOMwFIzNpNzZalWnX21JTA4qphqKsid9GYW1F5SkWCYmQxHg3WwfTA29eSa4yEEnk9eqKR0GnuWqQUJ9ZtzNxNxeSsY4wkzjqNaeYdHiB7-36uzQJU65RD1IOQ1FXo5zj_XMR1KVKxUfjFOhf2UR9-l2Y_T7jA9XVXhRCwg9OXIQB6j2MofVu4OlcTjDu3ry4E2Z8Vv-oB3tcxIFcFoedMJ_3HG0folDDQwQD6b6i_iZYPAYD9-MwEnE_79YVbCI31ktylYg5o5bL-1vK4ZeNzvxtzg_nRwkHV70b3gRqLP9PN0va7tqMFgEwXmbtdeHXouAWSwtX-RCjL5IhLi7Dw"

    if (peer.kind == "provider") {
        console.log("fetching netbird peers")
        const fetchUrl = "https://boring.dank.earth:33073/api/peers?user_id_override=" + peer.id;
        const response = await fetch(fetchUrl, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': accesstoken,
            }
        });
        console.log(response);
        const data = await (response.json()) as any;
        const firstPeer = data[0];

        if (response.ok) {
            if (data != null && firstPeer != null && firstPeer.key != null) {
                const peer = await prisma.peer.update({
                    where: { id: peerId },
                    data: {
                        pubkey: String(firstPeer.key),
                    },
                });
                res.statusCode = 200;
                res.json(peer);
                return
            }
        } else {
            res.statusCode = 500;
            return "api error retrieving peer info"
        }
    } else {
        // not a provider
        res.statusCode = 200;
        return
    }
}