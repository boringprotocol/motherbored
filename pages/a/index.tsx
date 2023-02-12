import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Define a TypeScript interface to describe the shape of the user object
interface User {
  name?: string;
  bio?: string;
  image?: string;
}

const UserPage = () => {
  // Use the User interface as the type for the user state
  const [user, setUser] = useState<User>({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(`/api/user/${id}`);
      // Use the User interface to type the returned data from the API
      const userData: User = await response.json();
      setUser(userData);
    }
    fetchUserData();
  }, [id]);


  return (
    <div>
      <h1>{user.name || id}</h1>
      <p>Bio: {user.bio}</p>
      <p>Image: {user.image}</p>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const response = await fetch(`/api/user/${id}`);
  // Use the User interface to type the returned data from the API
  const user: User = await response.json();

  return {
    props: {
      user,
    },
  };
}

export default UserPage;
