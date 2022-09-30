import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const keypair = Keypair.generate();

  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(keypair));


  // See about some Scoogis
  const mint = new PublicKey("22bKSRkhQywMVPDguBs1KJu5VkHvrXDFjHcKqJJLKcTu");
  const nft = await metaplex.nfts().findByMint(mint);
  
  // log json formatted metadata
  console.log(nft.metadata);
  
})();

export default function MePage() {
  const { data } = useSession()
  const { data: session, status } = useSession();

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
      <span className="font-jetbrains text-xs truncate">
                hello
              </span>

      </div>
      {!session && (<pre>not authenticated</pre>)}
      {session?.user && (<pre>{JSON.stringify(data, null, 2)}</pre>)}
    </LayoutAuthenticated>
  )
}
