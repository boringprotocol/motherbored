// /pages/api/account-records-averages/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accounts = await prisma.accountRecordsAverages.findMany();
  res.json(accounts);
}
