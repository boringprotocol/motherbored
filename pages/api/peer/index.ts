import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import fetch from 'node-fetch';

// POST /api/peer
export default async function handle(req: any, res: any) {
    const { name, kind, target } = req.body;
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
            User: { connect: { wallet: session.user.name } }
        },
    });

    // here's where we fetch to netbird for extra info

    // todo, fetch this token if expired
    const accesstoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkpZc01hcUxFUzMtRElTdDdwdE5KeSJ9.eyJpc3MiOiJodHRwczovL2Rldi03NjEyLXRiZC51cy5hdXRoMC5jb20vIiwic3ViIjoibEFUQ21lMTlnNHU2ZDdCVExJMXFkdDIyUmVWV2JpUnJAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYm9yaW5nIiwiaWF0IjoxNjYzMTA3NTIyLCJleHAiOjE2NjMxOTM5MjIsImF6cCI6ImxBVENtZTE5ZzR1NmQ3QlRMSTFxZHQyMlJlVldiaVJyIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.HOMwFIzNpNzZalWnX21JTA4qphqKsid9GYW1F5SkWCYmQxHg3WwfTA29eSa4yEEnk9eqKR0GnuWqQUJ9ZtzNxNxeSsY4wkzjqNaeYdHiB7-36uzQJU65RD1IOQ1FXo5zj_XMR1KVKxUfjFOhf2UR9-l2Y_T7jA9XVXhRCwg9OXIQB6j2MofVu4OlcTjDu3ry4E2Z8Vv-oB3tcxIFcFoedMJ_3HG0folDDQwQD6b6i_iZYPAYD9-MwEnE_79YVbCI31ktylYg5o5bL-1vK4ZeNzvxtzg_nRwkHV70b3gRqLP9PN0va7tqMFgEwXmbtdeHXouAWSwtX-RCjL5IhLi7Dw"

    if (kind == "provider") {

        const body = { type: "reusable", name: result.id, account_id_override: result.id, user_id_override: result.id };
        const response = await fetch('https://boring.dank.earth:33073/api/setup-keys', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Authorization': accesstoken,
            }
        });

        console.log(response)

        const data = await (response.json()) as any;

        console.log(data);

        const updateit = await prisma.peer.update({
            where: { id: result.id },
            data: {
                setupkey: data.key,
            },
        })
    } else if (kind == "consumer") {
        const body = { type: "reusable", name: target, account_id_override: target, user_id_override: target };
        const response = await fetch('https://boring.dank.earth:33073/api/setup-keys', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Authorization': accesstoken,
            }
        });

        console.log(response)

        const data = await (response.json()) as any;

        console.log(data);

        const updateit = await prisma.peer.update({
            where: { id: result.id },
            data: {
                setupkey: data.key,
            },
        })
    }
    res.json(result);
}
