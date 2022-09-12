import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import fetch from 'node-fetch';

// POST /api/peer
export default async function handle(req: any, res: any) {
    const { name, setupkey, kind, id } = req.body;
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

    // here's where we fetch to netbird
    if (kind == "producer") {
        // todo, fetch this token



        const accesstoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkpZc01hcUxFUzMtRElTdDdwdE5KeSJ9.eyJpc3MiOiJodHRwczovL2Rldi03NjEyLXRiZC51cy5hdXRoMC5jb20vIiwic3ViIjoibEFUQ21lMTlnNHU2ZDdCVExJMXFkdDIyUmVWV2JpUnJAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYm9yaW5nIiwiaWF0IjoxNjYyOTU4MDUxLCJleHAiOjE2NjMwNDQ0NTEsImF6cCI6ImxBVENtZTE5ZzR1NmQ3QlRMSTFxZHQyMlJlVldiaVJyIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.t6HvBC8deHa9TGIOY9IP-EBQBApLLi8vzaPNJvzyqKw9lq3d0NV7tlv27yrFshKrpzQaskjK7LD2YmrfvRm4ZIeTUt6mKHKFwMLWbN1keA_x4niB8JgOXn1QJ6--K6vgGk0iFfo78wz7vDgNUlSWMh3C0yTmiy3fiqWEBjp_A3iI51QCjqStd2dY22mZPixCYPhETSvkgXks_xIX_XMmMJxl5Uej-obuZHGDnX1rSCP58VWMcov6Kk0FUC4c9KGziQb1uNKJIK8zp1qBfoiMOhuMHGF16JxnjwXb-RshQvgwvDsFs4hXwtF7za_gv_MI3OUT7sqUxLI5_hEU_KKx_A"
        const body = { type: "one-off", name: name, account_id_override: name, user_id_override: name };
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
        // here's where we need to know the producers account name? ya.

    }
    res.json(result);
}