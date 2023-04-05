// components/Layout.tsx
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import SignIn from './SignIn';
import ThemeChanger from './themeChanger';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { data: session } = useSession();

  return (
    <>
      <div className="font-jetbrains">

        <main>{children}</main>

      </div>
      <div className="p-4 fixed top-0 right-0">
        {session && <><a className='btn btn-xs btn-outline mr-2' href="/">dashboard</a></>}
        <ThemeChanger />

        {!session && <SignIn />}

      </div>
    </>
  );
}
