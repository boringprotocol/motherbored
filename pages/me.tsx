import { useSession } from "next-auth/react"
import Layout from "../components/layout"

export default function MePage() {
  const { data } = useSession()
  const { data: session, status } = useSession();

  return (
    <Layout>
      <div className="px-12 py-12">
      <span className="font-jetbrains text-xs truncate">
                <IoWalletOutline />
                {session.user.email ?? session.user.name}
              </span>


{/* // 

lock a consumer to a particluar node yes/no
You will be able to access the internet only when connected to this peer (VPN). 
killswitch - don't connect to another network if the provider node is aborted 

*/}


      </div>
      {!session && (<pre>not authenticated</pre>)}
      {session?.user && (<pre>{JSON.stringify(data, null, 2)}</pre>)}
    </Layout>
  )
}
