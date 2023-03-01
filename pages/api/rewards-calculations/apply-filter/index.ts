import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { NextApiRequest, NextApiResponse } from "next";

const averagesFilePath = path.join(
  process.cwd(),
  "public/data/rewards-calculations/averages.csv"
);

type Row = { [key: string]: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Read the data from averages.csv
  const data: Row[] = [];
  fs.createReadStream(averagesFilePath)
    .pipe(csv())
    .on("data", (row) => data.push(row))
    .on("end", () => {
      // Calculate the total number of peers
      const totalPeers = data.reduce(
        (sum, row) =>
          sum + parseInt(row.provider_local) + parseInt(row.provider_cloud),
        0
      );

      // Initialize counters for the number of v1 and v2 licenses added
      let v1Added = 0;
      let v2Added = 0;

      // Apply the filters
      const filteredData = data.map((row) => {
        const newRow: Row = { ...row };

        // Check if there are any v1 licenses to add
        if (parseFloat(row.v1_license) > 0 && v1Added < totalPeers) {
          // Determine which field to add the license to
          if (parseFloat(row.provider_local) >= 1) {
            newRow.provider_local = (
              parseFloat(row.provider_local) + 0.5
            ).toFixed(2);
          } else if (parseFloat(row.provider_cloud) >= 1) {
            newRow.provider_cloud = (
              parseFloat(row.provider_cloud) + 0.5
            ).toFixed(2);
          }
          v1Added += 1;
        }

        // Check if there are any v2 licenses to add
        if (parseFloat(row.v2_license) > 0 && v2Added < totalPeers) {
          // Determine which field to add the license to
          if (parseFloat(row.provider_local) >= 1) {
            newRow.provider_local = (
              parseFloat(row.provider_local) + 0.25
            ).toFixed(2);
          } else if (parseFloat(row.provider_cloud) >= 1) {
            newRow.provider_cloud = (
              parseFloat(row.provider_cloud) + 0.25
            ).toFixed(2);
          }
          v2Added += 1;
        }

        return newRow;
      });

      // Send the filtered data as JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applied-filters.json"'
      );
      res.send(JSON.stringify(filteredData, null, 2));
    });
}
