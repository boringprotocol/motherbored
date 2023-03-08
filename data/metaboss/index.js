import AWS from 'aws-sdk';
const { exec } = require('child_process');
const fs = require('fs');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  // Execute the command and store the output in a JSON object
  const command = 'metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 9PyH3oZroZMEoX34vvfirD2L8GpLSQpYeFtRXBTA1HE3 --timeout 99999 --output - && metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 5Z1zMQFhCd25UgTHf5iDKu3hxGujrQ3UZFM18zfRTmVN --timeout 99999 --output - && metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 6yTqWnnBjN6WqNRPHxUQQZ5Z2WBEYNPAqkCgm3akwfDX --timeout 99999 --output - | jq --slurpfile v1 - --slurpfile v2 - --slurpfile vx - -n \'($v1[0] + $v2[0] + $vx[0]) | group_by(.owner_wallet) | .[] | {owner_wallet: .[0].owner_wallet,v1: map(select(.mint_account | contains($v1[0][]?.mint_account))) | length,v2: map(select(.mint_account | contains($v2[0][]?.mint_account))) | length,vx: map(select(.mint_account | contains($vx[0][]?.mint_account))) | length}\'';

  const result = await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });

  // Write the output to a JSON file
  const fileName = 'nft-snapshot.json';
  const filePath = `/tmp/${fileName}`;
  fs.writeFileSync(filePath, JSON.stringify(result));

  // Upload the file to S3
  const s3Bucket = 'metaboss-public-results';
  const s3Key = `public/${fileName}`;
  await s3.upload({
    Bucket: s3Bucket,
    Key: s3Key,
    Body: fs.createReadStream(filePath),
    ACL: 'public-read',
    ContentType: 'application/json'
  }).promise();

  // Generate a pre-signed URL for the file
  const url = s3.getSignedUrl('getObject', { Bucket: s3Bucket, Key: s3Key });

  // Return the URL as a JSON response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
    }),
  };
};
