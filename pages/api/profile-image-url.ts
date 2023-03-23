// /api/profile-image-url.ts
import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "your-bucket-name";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const wallet = req.query.wallet as string;

  if (!wallet) {
    return res.status(400).json({ message: "Missing wallet information." });
  }

  try {
    const existingProfileImage = await s3
      .listObjects({ Bucket: BUCKET_NAME, Prefix: `users/${wallet}/` })
      .promise();

    if (
      existingProfileImage.Contents &&
      existingProfileImage.Contents.length &&
      existingProfileImage.Contents[0].Key
    ) {
      const { Key } = existingProfileImage.Contents[0];
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${Key}`;
      const fileExtension = Key.split(".").pop() || "";

      return res.status(200).json({ url, fileExtension });
    } else {
      return res.status(200).json({ url: null, fileExtension: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching image URL" });
  }
}
