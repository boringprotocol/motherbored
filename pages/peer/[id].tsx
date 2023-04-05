// /pages/peer/[id].tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Peer } from '../../types';
import Layout from 'components/layout';

interface ServerSideProps {
  peer: Peer | { error: string };
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ params }) => {
  try {
    let peer = null;
    if (params && params.id) {
      console.log('Fetching peer data...');
      const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV,
      });

      const response = await axiosInstance.get(`/api/peer-profile/${params.id}`);
      console.log('Response:', response);
      peer = response.data;
      console.log('Peer:', peer);
    }
    return { props: { peer } };
  } catch (error) {
    console.error('Error fetching peer data:', error);
    return { notFound: true };
  }
};

const PeerPage = ({ peer }: ServerSideProps) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if ('error' in peer) {
    return <div>{peer.error}</div>;
  }

  if (!peer) {
    return <div>Peer not found.</div>;
  }

  return (

    <Layout>
      <div className="font-jetbrains container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{peer.name}</h1>
        owner: <a href={`/a/${peer.userId}`} className="text-blue-500">{peer.userId}</a>
      </div>
    </Layout>

  );
};

export default PeerPage;
