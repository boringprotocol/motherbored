import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BopLogo from "./art/bopLogo";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface Claim {
  id: string;
  amount: number;
  claimed: boolean;
}

interface Props { }

interface State {
  claims: Claim[] | null;
  error: string | null;
}

function Claims(props: Props) {
  const { data: session, status } = useSession();

  const [state, setState] = useState<State>({
    claims: null,
    error: null,
  });

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session:", session);

      const email = session.user?.email;
      const name = session.user?.name;
      const walletAddress = email ?? name;

      fetch(`/api/claims/get-claims?wallet=${walletAddress}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setState({ claims: result, error: null });
          },
          (error) => {
            setState({ claims: null, error: "Error loading claims" });
          }
        );
    }
  }, [session, status]);

  const { claims, error } = state;

  const handleProcessClaim = async (id: string) => {
    try {
      const response = await fetch(`/api/claims/process-claims?id=${id}`, {
        method: "POST",
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!claims) {
    return <div>Loading claims...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Rewards</h1>

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {claims.map((claim: Claim) => (
          <li key={claim.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            {/* <p>ID: {claim.id}</p> */}
            {/* <p>$BOP: {claim.amount}</p> */}
            <p className="p-1">Issued: {claim.claimed ? "Yes" : "No"}</p>
            {!claim.claimed && (
              <>

                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">Epoch()</h3>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">{claim.amount} $BOP</p>
                  </div>
                  <span className="h-10 w-10 flex-shrink-0 rounded-full p-1 text-boring-orange border">
                    <BopLogo />
                  </span>
                </div>

                <div>
                  <div className="-mt-px flex divide-x divide-gray-200 text-xs">
                    <div className="flex w-0 flex-1">
                      <a
                        href=""
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2  text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-3">Bond</span>
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a
                        href=""
                        className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-2  text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-3">Claim</span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <h1 className="text-xl font-bold mb-2 mt-8">Claimed Rewards</h1>
      {claims.map((claim: Claim) => (
        <div key={claim.id} className="">
          {/* <p>ID: {claim.id}</p> */}
          {/* <p>$BOP: {claim.amount}</p> */}
          {/* <p>Issued: {claim.claimed ? "Yes" : "No"}</p> */}
          {claim.claimed && (
            <button onClick={() => handleProcessClaim(claim.id)} className="border rounded-sm p-2 mt-2">
              <div className="w-8 float-left"><BopLogo /></div>
              <div className="pt-4 text-xs">$BOP {claim.amount}</div>
            </button>
          )}
        </div>
      ))}


    </div>
  );
}


export default Claims;
