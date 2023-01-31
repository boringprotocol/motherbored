import { useEffect, useState } from "react";
import prismaClient from "../lib/prisma";


const Peers = () => {
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await prismaClient.peer.findMany({
        include: {
          User: true
        },
        where: {
          pubkey: {
            isNot: null
          }
        },
        select: {
          Peer: true,
          User: {
            wallet: true
          }
        }
      });
      setPeers(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {peers.map((peer) => (
        <div key={peer.id}>
          <p>Peer: {peer.pubkey}</p>
          <p>User Wallet: {peer.User.wallet}</p>
        </div>
      ))}
    </div>
  );
};

export default Peers;
