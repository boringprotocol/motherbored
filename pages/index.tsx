import { getSession, useSession } from "next-auth/react"
import Layout from "../components/layout";
import React from "react"
import { GetServerSideProps } from "next"
import Peer, { PeerProps } from "../components/Peer"
import prisma from "../lib/prisma";
import Link from "next/link";

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { peers: [] } }
  }


  const user = await prisma.user.findFirst({
    where: { wallet: session.user?.name }
  })


  if (user == null) {
    if (session.user?.name) {
      const sessionUser = session.user?.name
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
        yo brosephs, check out this webpage. try to connect with phantom and once connected, go to each page and back and then even try to refresh the browser and see if the wallet connection persists. it should. you'll need to approve twice in phantom. also phantom should pop up autmoatically when you hit the site for the first time. let me know if all this crap works.
      </Layout>
    );
  }
  return (
    <Layout>
      yo brosephs, you're logged in so go ahead and twiddle your peers
      <h1>Peers</h1>
      <div>
        <Link href="/newpeer">
          <button>
            <a>New peer</a>
          </button>
        </Link>
      </div>
      {props.peers.map((peer) => (

        <div key={peer.id} className="peer">
          <Peer peer={peer} />
        </div>
      ))}
    </Layout>
  );
}

export { getServerSideProps }

export default IndexPage