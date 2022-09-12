import { useSession } from "next-auth/react"
import Layout from "../components/layout"

export default function MePage() {
  const { data } = useSession()
  const { data: session, status } = useSession();

  return (
    <Layout>
      {!session && (<pre>not authenticated</pre>)}
      {session?.user && (<pre>{JSON.stringify(data, null, 2)}</pre>)}
    </Layout>
  )
}
