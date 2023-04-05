// components/Protected.tsx
import { useSession } from 'next-auth/react';

interface Props {
  role: number;
  children?: React.ReactNode;
}

interface Role {
  id: number;
  name: string;
  max_peers: number;
  max_claims: number;
  max_drips: number;
  subscriptionId: string | null;
}

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
}

interface Session {
  user: User | null;
  expires: string;
  publicKey: string;
}

export default function Protected({ role, children }: Props) {
  const { data: session, status } = useSession<Session>({ required: true });

  console.log("session: ", session);
  console.log("status: ", status);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const user: User | undefined = session?.user;

  console.log("user: ", user);

  if (!user || !user.role || user.role.id !== role) {
    return null;
  }

  return <>{children}</>;
}
