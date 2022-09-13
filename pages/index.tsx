import { getSession, useSession } from "next-auth/react";
import Layout from "../components/layout";
import React from "react";
import { GetServerSideProps } from "next";
import Peer, { PeerProps } from "../components/Peer";
import prisma from "../lib/prisma";
import Link from "next/link";
import Head from 'next/head';



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
        <Head>
        <title>Boring Protocol</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        
        <div className="bg-white font-jetbrains">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-indigo-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to go?</span>
                <span className="block">Let's connect your Motherbored.</span>
              </h2>
              <p className="font-jetbrains mt-4 text-lg leading-6 text-indigo-200">
                Click "Add Peer" to add your Motherbored to the Boring Protocol Network. We'll see you online in just a few minutes. 
              </p>
              <a
                href="#"
                className="mt-8 inline-flex items-center rounded-sm border border-transparent bg-white px-5 py-3  font-medium text-indigo-600 shadow hover:bg-indigo-50"
              >
                Add Peer
              </a>
            </div>
          </div>
          <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
            <img
              className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="https://tailwindui.com/img/component-images/full-width-with-sidebar.jpg"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
    </div>

      </Layout>
    );
  }
  return (
    <Layout>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>    
        
      <div className="">     
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
