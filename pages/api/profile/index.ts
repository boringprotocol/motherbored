import { getSession } from "next-auth/react"; // import the getSession function from next-auth/react
import { GetServerSideProps } from "next"; // import the GetServerSideProps type from next
import prisma from "../../../lib/prisma"; // import the prisma client


export const updatePublicProfile = async (userId: string, publicProfile: boolean) => {
  const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { publicProfile },
  });
  return updatedUser;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req }); // get the session from the request

  // check if the session exists, if the session contains a user object, and if the user object has a name property
  if (!session || !session.user || !session.user.name) {
    res.statusCode = 403; // set the status code to 403
    return { props: { user: {} } }; // return an empty user object as a prop
  }

  let user = await prisma.user.findFirst({
    where: { wallet: session.user.name },
    include: { peers: true },
  }); // retrieve the user from the database where the wallet is equal to the session user's name, and include the user's peers

  if (!user) {
    res.statusCode = 404; // set the status code to 404
    return { props: { user: {} } }; // return an empty user object as a prop
  }

  const peers = await prisma.peer.findMany({
    where: { userId: user.id },
  }); // retrieve the user's peers from the database where the userId is equal to the user's id

  if (params && params.userId && params.publicProfile !== undefined) {
    user = await prisma.user.update({
      where: { id: params.userId },
      data: { publicProfile: params.publicProfile },
    });
  }

  return {
    props: { user, peers },
  };
};

