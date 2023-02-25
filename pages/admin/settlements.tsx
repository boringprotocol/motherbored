import { getSession, useSession } from "next-auth/react";
import LayoutAuthenticated from "../../components/layoutAuthenticated";
import React from "react";
import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { GetPeersForPubkey } from "../../lib/influx";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}) => {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: {} };
  }

  const user = await prisma.user.findFirst({
    where: { wallet: session.user.name },
  });

  if (user == null || user.id == null) {
    res.statusCode = 403;
    return { props: {} };
  }

  const providerPeers = await prisma.peer.findMany({
    where: { kind: "provider", pubkey: { not: null } },
    select: {
      name: true,
      id: true,
      country_code: true,
      label: true,
      userId: true,
      pubkey: true,
    },
  });

  let allPeers: SettlePeer[] = [];

  // Add providers peers to the allPeers array
  for (let p of providerPeers) {
    if (p.userId == null) {
      res.statusCode = 403;
      return { props: { peers: {} } };
    }
    if (p.pubkey == null) {
      res.statusCode = 403;
      return { props: { peers: {} } };
    }

    const connected = await GetPeersForPubkey(p.pubkey, "1d");
    console.log(connected);
    console.log("HELLO");
    const pUser = await prisma.user.findFirst({
      where: { id: p.userId },
    });
    if (pUser == null) {
      res.statusCode = 403;
      return { props: { peers: {} } };
    }
    if (p.name == null) {
      res.statusCode = 403;
      return { props: { peers: {} } };
    }
    allPeers.push({
      name: p.name,
      wallet: pUser?.wallet,
      connected: connected,
      kind: "provider",
      id: p.id,
      pubkey: p.pubkey,
    });
  }



  // catchall return, consumers get here
  return {
    props: { peers: allPeers },
  };
};

type SettlePeer = {
  name: string;
  wallet: string;
  connected: string | unknown;
  kind: string;
  id: string;
  pubkey: string;
};

type Props = {
  peers: SettlePeer[];
};

const Settlements: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);

  const handleDownload = () => {
    // Create an array of rows to be added to the CSV
    const rows: { name: string; wallet: string; connected: unknown; kind: string; id: string; pubkey: string; }[] = [];

    props.peers.forEach((peer) => {
      rows.push({
        name: peer.name,
        wallet: peer.wallet,
        connected: peer.connected,
        kind: peer.kind,
        id: peer.id,
        pubkey: peer.pubkey,
      });
    });

    // Convert the rows array to a CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((row) => {
      csvContent += row.name + "," + row.wallet + "," + row.connected + "," + row.kind + "," + row.id + "," + row.pubkey + "\r\n";
    });

    // Encodes the CSV content string in order to make it usable in a link
    const encodedUri = encodeURI(csvContent);

    // Create a link element and simulate a click on it
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "peers.csv");
    document.body.appendChild(link);

    // Dispatch click event on the link
    link.click();
  };

  const handleSave = async () => {
    // Create an array of rows to be added to the CSV
    const rows: { name: string; wallet: string; connected: unknown; kind: string; id: string; pubkey: string; }[] = [];

    props.peers.forEach((peer) => {
      rows.push({
        name: peer.name,
        wallet: peer.wallet,
        connected: peer.connected,
        kind: peer.kind,
        id: peer.id,
        pubkey: peer.pubkey,
      });
    });

    // Convert the rows array to a CSV
    let csvContent = "";
    rows.forEach((row) => {
      csvContent += row.name + "," + row.wallet + "," + row.connected + "," + row.kind + "," + row.id + "," + row.pubkey + "\r\n";
    });
    try {
      const res = await fetch('/api/save-settlements', {
        method: 'POST',
        body: csvContent,
        headers: { 'Content-Type': 'text/csv' },
      });
      const json = await res.json();
      if (json.success) {
        alert("File saved successfully!");
      } else {
        alert("An error occurred while saving the file");
      }
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <LayoutAuthenticated>

      <div className="">

        <div className="border-b border-gray-light dark:border-gray-dark">

          <div className="mt-12 px-12 text-xs"><span className="text-xs text-gray">boring-settlements:</span> load provider peers with active consumer connections.</div>

          <button className='ml-12 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm' onClick={handleDownload}>Download as CSV</button>
          <button className='m-6 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm' onClick={handleSave}>Save as CSV</button>

        </div>

        <table className="w-full divide-gray-lightest dark:divide-gray-dark">
          <thead className="bg-boring-white dark:bg-boring-black">
            <tr>
              <th className="px-12 py-6 text-xs font-medium text-left text-gray-500 tracking-wider">Name</th>
              <th className="px-12 py-6 text-xs font-medium text-left text-gray-500 tracking-wider">Wallet</th>
              <th className="px-12 py-6 text-xs font-medium text-left text-gray-500 tracking-wider">Connected</th>
              <th className="px-12 py-6 text-xs font-medium text-left text-gray-500 tracking-wider">Id</th>
              <th className="px-12 py-6 text-xs font-medium text-left text-gray-500 tracking-wider">pubkey</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-lightest dark:divide-gray-dark dark:bg-boring-black">
            {props.peers.map((pp) => (
              <tr key={pp.name}>
                <td className="px-12 py-2 text-xs whitespace-nowrap">{pp.name}</td>
                <td className="px-12 py-2 text-xs whitespace-nowrap">{pp.wallet}</td>
                <td className="px-12 py-2 text-xs whitespace-nowrap">{pp.connected}</td>
                <td className="px-12 py-2 text-xs whitespace-nowrap">{pp.id}</td>
                <td className="px-12 py-2 text-xs whitespace-nowrap">{pp.pubkey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </LayoutAuthenticated>
  );
};

export default Settlements;
