import React from 'react'

import { useState } from 'react'


export type UserProps = {
    id: string;
    wallet: string;
    name: string;
    image: string;
    peers: string;
  };
  
  const User: React.FC<{ user: UserProps }> = ({ user }) => {
    const { name, image, peers } = user;
    
    // toggle
    const [enabled, setEnabled] = useState(false)
    return (
      <div className='px-6 pt-6'>
          <h2>{name}</h2>
          <p>Peers: {peers}</p>
      </div>
    );
  };
  
export default User;
