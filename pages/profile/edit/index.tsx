// page/profile/edit/index.tsx
import { useSession } from 'next-auth/react'
import Layout from '../../../components/layout'
import LayoutAuthenticated from '../../../components/layoutAuthenticated'
import React from 'react'
import Head from 'next/head'
import EditProfile from '../../../components/editProfile'

const ProfilePage: React.FC<Props> = ({ user }) => {

    const session = useSession();

    if (!session) {

        return (
            <Layout>
                <Head>
                    <title>Boring Protocol</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
            </Layout>
        );
    }

    return (
        <LayoutAuthenticated>
            <Head>
                <title>Motherbored - Boring Protocol</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="apple-touch-icon" href="/img/favicon.png" />
            </Head>

            <div className="main px-4 sm:px-12 text-xs mt-8">
                <EditProfile />
            </div>
        </LayoutAuthenticated>
    );
}

export default ProfilePage


