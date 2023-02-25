import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

interface MetaData {
  v1: any;
  v2: any;
  vx: any;
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const command = `metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 9PyH3oZroZMEoX34vvfirD2L8GpLSQpYeFtRXBTA1HE3 --timeout 99999 --output data/nft-snapshot && metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 5Z1zMQFhCd25UgTHf5iDKu3hxGujrQ3UZFM18zfRTmVN --timeout 99999 --output data/nft-snapshot && metaboss -r https://flashy-newest-sponge.solana-mainnet.quiknode.pro/ snapshot holders -c 6yTqWnnBjN6WqNRPHxUQQZ5Z2WBEYNPAqkCgm3akwfDX --timeout 99999 --output data/nft-snapshot && jq --slurpfile v1 data/nft-snapshot/9PyH3oZroZMEoX34vvfirD2L8GpLSQpYeFtRXBTA1HE3_holders.json --slurpfile v2 data/nft-snapshot/5Z1zMQFhCd25UgTHf5iDKu3hxGujrQ3UZFM18zfRTmVN_holders.json --slurpfile vx data/nft-snapshot/6yTqWnnBjN6WqNRPHxUQQZ5Z2WBEYNPAqkCgm3akwfDX_holders.json -n '
  ($v1[0] + $v2[0] + $vx[0]) | group_by(.owner_wallet) | .[] | {
    owner_wallet: .[0].owner_wallet,
    v1: map(select(.mint_account | contains($v1[0][]?.mint_account))) | length,
    v2: map(select(.mint_account | contains($v2[0][]?.mint_account))) | length,
    vx: map(select(.mint_account | contains($vx[0][]?.mint_account))) | length
  } | [.owner_wallet, .v1, .v2, .vx] | @csv' --raw-output > data/nft-snapshot/combined.csv && sed -i '' 's/"//g' data/nft-snapshot/combined.csv`;

  exec(command, async (error, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error });
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).json({ error: stderr });
      return;
    }

    try {
      const allData: MetaData = { v1: null, v2: null, vx: null };

      const [v1, v2, vx] = await Promise.all([
        fetch(
          "/data/nft-snapshot/9PyH3oZroZMEoX34vvfirD2L8GpLSQpYeFtRXBTA1HE3_holders.json"
        ).then((res) => res.json()),
        fetch(
          "/data/nft-snapshot/5Z1zMQFhCd25UgTHf5iDKu3hxGujrQ3UZFM18zfRTmVN_holders.json"
        ).then((res) => res.json()),
        fetch(
          "/data/nft-snapshot/6yTqWnnBjN6WqNRPHxUQQZ5Z2WBEYNPAqkCgm3akwfDX_holders.json"
        ).then((res) => res.json()),
      ]);

      allData.v1 = v1;
      allData.v2 = v2;
      allData.vx = vx;

      res.status(200).json(allData);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error parsing JSON" });
    }
  });
}
