// /api/upload-url.ts
import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "your-bucket-name";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const wallet = (req.query.wallet as string) || "";

  if (!wallet) {
    return res.status(400).json({ message: "Missing wallet information." });
  }

  const existingProfileImage = await s3
    .listObjects({ Bucket: BUCKET_NAME, Prefix: `users/${wallet}/` })
    .promise();

  let existingFileExtension = "";
  if (existingProfileImage.Contents && existingProfileImage.Contents.length) {
    const { Key } = existingProfileImage.Contents[0] || {};
    existingFileExtension = Key?.split(".").pop() || "";
  }

  const fileExtension = req.query.fileExtension || existingFileExtension;
  const contentType = `image/${fileExtension}`;

  if (!fileExtension) {
    return res
      .status(400)
      .json({ message: "Missing file extension information." });
  }

  const fileName = `${wallet}.${fileExtension}`;
  const s3Key = `users/${wallet}/${fileName}`;

  const fileSize = Number(req.headers["content-length"]);
  if (fileSize > MAX_FILE_SIZE) {
    return res.status(400).json({ message: "File size is too large." });
  }

  // Delete previous profile image if it exists
  try {
    if (existingProfileImage.Contents && existingProfileImage.Contents.length) {
      const objects = existingProfileImage.Contents.map(({ Key }) => ({ Key }));
      await s3
        .deleteObjects({
          Bucket: BUCKET_NAME,
          Delete: { Objects: objects, Quiet: true },
        })
        .promise();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting previous profile image" });
    return;
  }

  // Generate new signed URL for uploading profile image
  const s3Params = {
    Bucket: BUCKET_NAME,
    Fields: {
      key: s3Key,
      "Content-Type": contentType,
    },
    Expires: 60,
    Conditions: [["content-length-range", 0, MAX_FILE_SIZE]],
    ACL: "public-read",
  };

  try {
    const signedUrl = await s3.createPresignedPost(s3Params);

    res.status(200).json({
      url: signedUrl.url,
      fields: signedUrl.fields,
      fileExtension,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error signing S3 URL" });
  }
}
