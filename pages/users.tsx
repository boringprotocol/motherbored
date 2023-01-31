import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'

interface Props {
  userCount: number;
  providerPeerCount: number;
  consumerPeerCount: number;
  peerCountByCountry: Array<{ country_code: string, count: number }>;
}

const UsersPage: React.FC<Props> = ({ userCount, providerPeerCount, consumerPeerCount, peerCountByCountry }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/users/[id].tsx')
      .then(response => {
        const { userCount, providerPeerCount, consumerPeerCount, peerCountByCountry } = response.data
        setLoading(false)
        // do something with the data here
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [])


    return (
        <div>
            <Head>
                <title>Motherbored - Boring Protocol</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="apple-touch-icon" href="/img/favicon.png" />
            </Head>
            
            <h2>Users Stuff</h2>
          <p>Total number of users: {userCount}</p>
          <p>Total number of provider peers: {providerPeerCount}</p>
          <p>Total number of consumer peers: {consumerPeerCount}</p>
          <p>Number of peers per country:</p>
          <ul>
            {peerCountByCountry && peerCountByCountry.length > 0 ? peerCountByCountry.map(({ country_code, count }) => (
              <li key={country_code}>{country_code}: {count}</li>
            )) : 'No data'}
          </ul>
        </div>

    );
}

export default UsersPage
// export { getServerSidePropsUsers }

