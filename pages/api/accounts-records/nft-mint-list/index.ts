import { NodeSSH } from "node-ssh";
import { NextApiRequest, NextApiResponse } from "next";

const sshConfig = {
  host: process.env.SSH_HOST,
  port: parseInt(process.env.SSH_PORT || ""),
  username: process.env.SSH_USERNAME,
  privateKey: process.env.SSH_PRIVATE_KEY,
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(sshConfig);
    const result = await ssh.execCommand("./metaboss.sh");
    console.log(result.stdout);
    res.status(200).json({ message: "Script executed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error executing script" });
  } finally {
    ssh.dispose();
  }
}
