import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "rewards-points.json"
  );

  if (req.method === "GET") {
    const data = fs.readFileSync(filePath, "utf-8");
    const rewardsPoints = JSON.parse(data);
    res.status(200).json(rewardsPoints);
  } else if (req.method === "POST") {
    const rewardsPoints = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    Object.entries(req.body).forEach(([key, value]) => {
      if (rewardsPoints[key] !== undefined) {
        rewardsPoints[key] = Number(value);
      }
    });

    console.log("updated rewardsPoints: ", rewardsPoints);
    fs.writeFileSync(filePath, JSON.stringify(rewardsPoints));
    console.log("file written: ", fs.readFileSync(filePath, "utf-8"));

    res.status(200).json({ message: "Rewards points updated successfully!" });
  } else {
    res.status(405).end();
  }
}
