import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '../types';
import Image from 'next/image';
import { BsLightning } from 'react-icons/bs';

interface Props {
  user: User;
}

const UserProfile = ({ user }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.name) {
    return <div>User not found</div>;
  }

  if (!user.publicProfile) {
    return <div>This user's profile is not public</div>;
  }

  return (
    <div className="font-jetbrains">

      <div className="bg-white">
        <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {user.name}
              <br />
              {user.image}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-gray-600">
              {user.bio}
            </p>

            <p><span className="float-left"><BsLightning /></span>{user.ln_address}</p>
          </div>
        </div>
      </div>

      <h1></h1>
      <img src={user.image} alt={user.name} />
      <p></p>
      <Image src={user.image} alt={user.name} width={200} height={200} />
      <p>{user.wallet}</p>
      <p>{user.polygon_wallet}</p>

      <p>{user.publicProfile ? 'Public Profile' : 'Private Profile'}</p>
    </div>
  );
};


export default UserProfile;
