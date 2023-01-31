import { GetServerSideProps } from "next"; // import the GetServerSideProps type from next
import prisma from "../../../lib/prisma"; // import the prisma client

export const getServerSidePropsUsers: GetServerSideProps = async ({ req, res }) => {
  // Add your queries here to retrieve the necessary data from the database
  // You can use the prisma client to perform database operations
  // For example, to get the total number of users:
  const userCount = await prisma.user.count();
  const peerCount = await prisma.peer.count();
  const providerPeerCount = await prisma.peer.count({ where: { provider_kind: "provider" } });
  const consumerPeerCount = await prisma.peer.count({ where: { provider_kind: "consumer" } });
  const peerCountByCountry = await prisma.peer.aggregate({
    groupBy: {country_code: 'country_code' },
    select: {
        country_code: true,
        count: true
    },
});




  // Return the data as props
  return {
    props: { userCount, providerPeerCount, consumerPeerCount, peerCountByCountry },
  };
};
