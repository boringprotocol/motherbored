import { getSession, useSession } from "next-auth/react";
import Layout from "../components/layout";
import React from "react";
import { GetServerSideProps } from "next";
import Peer, { PeerProps } from "../components/Peer";
import prisma from "../lib/prisma";
import Link from "next/link";

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403;
    return { props: { peers: [] } }
  }

  const user = await prisma.user.findFirst({
    where: { wallet: session.user.name }
  })


  if (user == null) {
    if (session.user.name) {
      const sessionUser = session.user.name
      const user = await prisma.user.create({
        data: {
          wallet: sessionUser,
        },
      })
    }
  }

  const peers = await prisma.peer.findMany({
    where: { userId: user?.id },
  })
  return {
    props: { peers },
  }
}

type Props = {
  peers: PeerProps[]
}

const IndexPage: React.FC<Props> = (props) => {
  const { data } = useSession();
  const { data: session, status } = useSession();
  if (!session) {
    return (
      <Layout>
        Hello please login
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="bt b--black-10">
      you are in so go ahead and twiddle your peers
      <h1 className="ttu fw1">Peers</h1>
      <div>
        <Link href="/newpeer">
          <button className="bg-black white pv3 ph3 br2 bn">
            <a>New peer</a>
          </button>
        </Link>
      </div>
      {props.peers.map((peer) => (

        <div key={peer.id} className="peer">
          <Peer peer={peer} />
        </div>
      ))}

    </div>
    </Layout>
  );
}

export { getServerSideProps }

export default IndexPage
