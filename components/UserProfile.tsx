import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User, Drip, Claim, Peer } from 'types';
import { BsLightning } from 'react-icons/bs';
import Link from 'next/link';
import CopyToClipboardButton from './CopyToClipboardButton';

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

  console.log(user);

  return (
    <>
      <div className="font-jetbrains">

        <section className="pt-16">
          <div className="w-full lg:w-4/12 px-4 mx-auto">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-md rounded-sm mt-16">
              <div className="px-6">

                <div className="text-center mt-12">
                  <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {user.name}
                  </h3>

                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={user.image} alt={user.name} />
                    </div>
                  </div>

                </div>

                <div className="mt-10 py-10">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-xs">
                        {user.bio}
                      </p>
                      <p className="mb-4 text-xs text-left"><span className="float-left mr-2"><BsLightning /></span>{user.ln_address}</p>
                    </div>
                    <p className="text-xs">{user.wallet}</p>
                    <CopyToClipboardButton text={user.wallet} />
                    <p className="text-xs">{user.website}</p>
                  </div>


                  <div className="w-full px-4 mx-auto">

                    <h2 className="text-sm mb-4">Nodes</h2>
                    {user.peers && user.peers.length > 0 ? (
                      user.peers
                        .filter((peer: Peer) => peer.kind === 'provider')
                        .map((peer: Peer) => (
                          <div key={peer.id} className="mb-4 text-xs">
                            <Link href={`/peer/${peer.id}`}>{peer.name}</Link>
                            {peer.country_code}
                          </div>
                        ))
                    ) : (
                      <p>No peers available.</p>
                    )}


                    <h2 className="text-sm mb-4">Drips</h2>
                    {user.drips && user.drips.length > 0 ? (
                      user.drips
                        .filter((drip: Drip) => drip.approved === true)
                        .map((drip: Drip) => (
                          <div key={drip.id} className="mb-4 text-xs">
                            <Link href={`/drip/${drip.id}`}>{drip.name}</Link>
                          </div>
                        ))
                    ) : (
                      <p>No drips available.</p>

                    )}

                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default UserProfile;
