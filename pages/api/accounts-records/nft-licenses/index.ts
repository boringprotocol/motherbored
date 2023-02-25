import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface CsvRow {
  wallet: string;
  v1_license: number;
  v2_license: number;
  vx_license: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { snapshot } = req.body;

  const csvData = fs.readFileSync(
    path.join(process.cwd(), "data/nft-snapshot/combined.csv"),
    "utf-8"
  );

  const rows: CsvRow[] = parse(csvData, {
    columns: ["wallet", "v1_license", "v2_license", "vx_license"],
    skip_empty_lines: true,
  });

  const promises = rows.map(async (row) => {
    const { wallet, v1_license, v2_license, vx_license } = row;
    const updateResult = await prisma.accountHistory.updateMany({
      where: { wallet, snapshot },
      data: {
        v1_license: Number(v1_license),
        v2_license: Number(v2_license),
        vx_license: Number(vx_license),
      },
    });
    return updateResult.count;
  });

  const results = await Promise.all(promises);
  const count = results.reduce((acc, val) => acc + val, 0);

  res.status(200).json({ count });
}
