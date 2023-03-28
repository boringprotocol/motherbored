// components/DestroyProviderPeer.tsx
import React from "react"
import Router from "next/router"
import { toast } from 'react-toastify'

type DestroyProviderPeerProps = {
  peerId: string
}

const DestroyProviderPeer: React.FC<DestroyProviderPeerProps> = ({ peerId }) => {
  // Deleting Peer / "Reset"
  async function deletePeer(id: string): Promise<void> {
    const body = { id: id }
    const result = await fetch(`/api/peer/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (result.ok) {
      toast.success('Peer Deleted')
    } else {
      // notify("Oh no! We couldn't delete this peer. Try again.");
      toast.error('Oh no! We couldnt delete this peer. Try again')
    }
    await Router.push(`/`);
  }

  return (
    <>
      {/* Destroy Peer */}
      <div className="p-8">

        <div className="alert">

          <div className="text-boring-black dark:text-boring-white mt-6">
            <div className="px-4 sm:p-6">
              <h3 className="text-lg font-medium ">Destroy Peer</h3>
              <div className="mt-2 max-w-xl text-xs ">
                <p>Once you reset your peer, all data associated with it goes away, forever.</p>
              </div>
              <div className="mt-5">

                <form>
                  <button
                    type="button"
                    className="mt-6 flex justify-center rounded-sm border border-gray dark:border-black  text-boring-black dark:text-boring-white dark:bg-black py-2 px-2 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-boring-blue focus:ring-offset-2 w-40"
                    onClick={() => deletePeer(peerId)}
                  >
                    Destroy
                  </button>

                </form>

              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}

export default DestroyProviderPeer;
