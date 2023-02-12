import { getSession, useSession } from 'next-auth/react'
import Layout from '../components/layout'
import LayoutAuthenticated from '../components/layoutAuthenticated'
import React from 'react'
import { GetServerSideProps } from 'next'
import fs from 'fs'
import path from 'path'
import prisma from '../lib/prisma'

const WHITELIST_FILE = path.join(process.cwd(), 'whitelist.txt')

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

    const session = await getSession({ req });
    if (!session || !session.user || !session.user.name) {
      res.statusCode = 403;
      return { props: {} };
    }

  // Read the whitelist file
  const whitelist = fs.readFileSync(WHITELIST_FILE, 'utf-8').split('\n')
  
  // Check if the user is in the whitelist
  if (!whitelist.includes(session.user.name)) {
    res.statusCode = 403;
    return { props: {} };
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

  return { props: {} };
}

const AdminPage = () => {
    const { data: session } = useSession();
    if (!session) {
      return (
        <Layout>
        <div>
          <h1>This page is not accessible</h1>
          <p>Please sign in to view the content.</p>
        </div>
        </Layout>
      );
    }
  
    return (
        <LayoutAuthenticated>
      <div>
        {/* <h1>Welcome {session.user.name}</h1> */}
        <p>This is an example page!</p>
        <p>You can put any content you want here.</p>
      </div>
      </LayoutAuthenticated>
    );
  };
  
  export default AdminPage;
  export { getServerSideProps }
