// pages/api/rewards-calculations/download-averages/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { unparse } from "papaparse";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accountRecordsAverages =
      await prisma.accountRecordsAverages.findMany();
    const csv = unparse(accountRecordsAverages, {
      header: true,
      delimiter: ",",
      newline: "\r\n",
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AccountRecordsAverages.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate CSV" });
  }
}
