import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"

export default function MePage() {
  const { data } = useSession()
  const { data: session, status } = useSession();

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
      <span className="font-jetbrains text-xs truncate">
                me
              </span>

      </div>
      {!session && (<pre>not authenticated</pre>)}
      {session?.user && (<pre>{JSON.stringify(data, null, 2)}</pre>)}
    </LayoutAuthenticated>
  )
}
