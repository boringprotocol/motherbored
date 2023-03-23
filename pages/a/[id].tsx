// /pages/a/[id].tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';
import UserProfile from '../../components/UserProfile';
import { User } from '../../types';
import { useRouter } from 'next/router';

interface ServerSideProps {
  user: User | { error: string };
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ params }) => {
  try {
    let user = null;
    if (params && params.id) {
      console.log('Fetching user data...');
      const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV,
      });

      const response = await axiosInstance.get(`/api/user-profile/${params.id}`);
      console.log('Response:', response);
      user = response.data;
      console.log('User:', user);
    }
    return { props: { user } };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { notFound: true };
  }
};

const UserProfilePage = ({ user }: ServerSideProps) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if ('error' in user) {
    return <div>{user.error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return <UserProfile user={user} />;
};

export default UserProfilePage;
