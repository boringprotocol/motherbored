import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from 'types';
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
    <>
      <div className="font-jetbrains">

        <section className="pt-16">
          <div className="w-full lg:w-4/12 px-4 mx-auto">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-md rounded-sm mt-16">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 flex justify-center">
                    <div className="relative">
                      <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px" />
                    </div>
                  </div>

                </div>
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

                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-xs">
                        {user.bio}
                      </p>
                      <p className="mb-4 text-xs text-left"><span className="float-left mr-2"><BsLightning /></span>{user.ln_address}</p>
                    </div>
                    <p className="text-xs">{user.wallet}</p>
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
