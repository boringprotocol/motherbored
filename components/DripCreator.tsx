import axios from "axios";
import { useState, useEffect } from "react";

interface User {
  image: ReactNode;
  id: string;
  name: string;
  email: string;
  bio: string;
  role: string;
  website: string;
}

interface DripCreatorProps {
  userId: string;
}

export default function DripCreator({ userId }: DripCreatorProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios
      .get(`/api/user-profile/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.log(error));
  }, [userId]);

  if (!user) {
    return <div>Loading creator profile...</div>;
  }

  return (
    <div className="flex items-center">
      <div className="text-lg card card-bordered p-2">
        <div className="text-xs">{user.name}</div>
        {/* <div className="text-sm text-gray-500">{user.bio}</div> */}
        <div className="text-xs text-gray-500">role: {user.role}</div>
        {/* <div className="text-sm text-gray-500">website: {user.website}</div> */}
        <div className="avatar">
          <div className="w-8 mask mask-squircle">
            <img src={user.image} alt="user image" />
          </div>
        </div>
      </div>
    </div>
  );
}
