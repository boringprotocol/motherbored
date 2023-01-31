import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function saveSettlements(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    fs.writeFile(
      path.join(process.cwd(), "data/settlements/peers.csv"),
      body,
      (err) => {
        if (err) {
          res.status(500).json({ success: false });
        } else {
          res.status(200).json({ success: true });
        }
      }
    );
  });
}
