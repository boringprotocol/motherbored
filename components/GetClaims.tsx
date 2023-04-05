// /components/GetClaims.tsx
// todo: refactored to use ClaimContext w/ UnclaimedClaims.tsx and ClaimedClaims.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaExternalLinkAlt } from "react-icons/fa";

import classNames from "classnames";
import { useClaimContext } from "../contexts/ClaimContext";

interface Claim {
  updatedAt: string;
  signature: string;
  id: string;
  token: string;
  pending: boolean;
  amount: number;
  label: string;
  createdAt: Date;
  claimed: boolean;
  tokenMintAddress: string;
}

// Define a new type for the appearingClaims and disappearingClaims state properties
type TransitionState = {
  [claimId: string]: boolean;
};

function GetClaims() {

  const { claimUpdated, setClaimUpdated } = useClaimContext();

  const [state, setState] = useState<{
    claims: Claim[];
    loadingClaims: { [claimId: string]: boolean };
    error: string | null;
    signature: string | null;
    signatures: { [claimId: string]: string | null };
    disappearingClaims: TransitionState;
    appearingClaims: TransitionState;

  }>({
    claims: [],
    loadingClaims: {},
    error: null,
    signature: null,
    signatures: {},
    disappearingClaims: {},
    appearingClaims: {},
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const email = session.user?.email;
      const name = session.user?.name;
      const walletAddress = email ?? name;

      fetch(`/api/claims/get-claims?wallet=${walletAddress}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setState((prevState) => ({
              ...prevState,
              claims: result,
              error: null,
            }));

            // Trigger the transition once the claims have been fetched
            setTimeout(() => {
              const initialAppearingClaims = result.reduce((acc: TransitionState, claim: Claim) => {
                if (claim.claimed) {
                  acc[claim.id] = true;
                } else {
                  acc[claim.id] = false;
                }
                return acc;
              }, {});

              const initialDisappearingClaims = result.reduce((acc: TransitionState, claim: Claim) => {
                if (!claim.claimed) {
                  acc[claim.id] = false;
                } else {
                  acc[claim.id] = true;
                }
                return acc;
              }, {});

              setState((prevState) => ({
                ...prevState,
                appearingClaims: initialAppearingClaims,
                disappearingClaims: initialDisappearingClaims,
              }));
            }, 100);
          },
          (error) => {
            setState((prevState) => ({
              ...prevState,
              claims: [],
              error: "Error loading claims",
            }));
          }
        );
    }
  }, [session, status, claimUpdated]);


  async function handleProcessClaim(id: string) {
    console.log("Processing claim with ID:", id);

    try {
      setState((prevState) => ({
        ...prevState,
        loadingClaims: { ...prevState.loadingClaims, [id]: true },
      }));

      const claim = state.claims?.find((c) => c.id === id);
      console.log('Processing claim:', claim); // Add this line



      if (!claim) {
        throw new Error("Claim not found");
      }

      const userWallet = session?.user?.email ?? session?.user?.name;

      if (!userWallet) {
        throw new Error("No wallet address found");
      }

      const response = await fetch(`/api/claims/process-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: userWallet,
          amount: claim.amount,
          tokenMintAddress: claim.tokenMintAddress, // Add this line
          id: claim.id, // Add this line
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process claim");
      }

      const result = await response.json();
      console.log(result);


      if (result.success) {

        // Set claimUpdated to true
        setClaimUpdated(true);

        setState((prevState) => ({
          ...prevState,
          disappearingClaims: { ...prevState.disappearingClaims, [id]: true },
        }));

        setTimeout(() => {
          setState((prevState) => {
            const updatedClaims = prevState.claims.map((c) =>
              c.id === id ? { ...c, claimed: true } : c
            );

            return {
              ...prevState,
              claims: updatedClaims,
            };
          });
        }, 3000); // Change this value to match the CSS transition duration, e.g., 1000 for 1 second

        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            appearingClaims: { ...prevState.appearingClaims, [id]: true },
          }));
        }, 3100);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error); // Log the error object for better debugging
        alert("An unexpected error occurred."); // Display a generic message for other types of errors
      }
    } finally {
      setState((prevState) => ({
        ...prevState,
        loadingClaims: { ...prevState.loadingClaims, [id]: false },
      }));
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  if (state.error) {
    return <div>{state.error}</div>;
  }

  if (!state.claims) {
    return <div>Loading claims...</div>;
  }

  return (
    <div>
      {/* <h3 className="text-sm mt-6 mb-2">Unclaimed Rewards</h3> */}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.claims
          .filter((claim: Claim) => !claim.claimed)
          .map((claim: Claim) => {
            console.log("Creating button for claim ID:", claim.id);

            return (

              <div
                className={classNames(
                  "card card-bordered shadow-xl prose",
                  state.disappearingClaims[claim.id] ? "opacity-0" : "opacity-100",
                  "transition-opacity duration-1000"
                )}
                key={claim.id}
                style={{
                  backgroundColor: state.disappearingClaims[claim.id]
                    ? "#edebeb" // Light mode flash color
                    : "inherit",
                }}
              >
                <div className="card-body">
                  <h2 className="text-xs mt-0">
                    {claim.label}
                  </h2>

                  {claim.pending ? <span className="text-xs badge badge-outline">pending</span> : ""}


                  <p className="text-xs">
                    Issued at: {claim.createdAt}
                  </p>

                  <p className="text-xs uppercase">
                    {claim.amount} ${claim.token}
                  </p>

                  <button
                    className="btn btn-xs btn-secondary btn-outline"
                    onClick={() => {
                      console.log("Clicked claim button with ID:", claim.id);
                      handleProcessClaim(claim.id);
                    }}
                    disabled={state.loadingClaims[claim.id] || claim.pending}
                  >
                    {state.loadingClaims[claim.id] ? (
                      <>
                        <span className="float-left pr-2">
                          <FontAwesomeIcon icon={faSpinner} spin />
                        </span>
                        Claiming...
                      </>
                    ) : (
                      "Claim"
                    )}
                  </button>


                  {state.signatures[claim.id] && (
                    <p>
                      <a
                        href={`https://solscan.io/tx/${state.signatures[claim.id]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View transaction on Solscan
                      </a>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <h3 className="text-sm mt-6 mb-2">Claimed Rewards</h3>
      <div className="overflow-x-auto mb-8">

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Token</th>
              <th>Amount</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {state.claims
              .filter((claim: Claim) => claim.claimed)
              .map((claim: Claim) => (
                <tr
                  className={classNames(
                    state.appearingClaims[claim.id] ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-1000"
                  )}
                  key={claim.id}
                  style={{
                    backgroundColor: state.appearingClaims[claim.id]
                      ? "transparent" // Dark mode flash color
                      : "inherit",
                  }}
                >
                  <td className="py-2 truncate text-xs text-gray dark:text-gray">
                    {claim.updatedAt}
                  </td>
                  <td className="py-2 truncate text-xs text-gray dark:text-gray uppercase">
                    ${claim.token}
                  </td>
                  <td className="py-2 truncate text-xs text-gray dark:text-gray">
                    {claim.amount}
                  </td>
                  <td className="py-2 truncate text-xs text-gray dark:text-gray">
                    <a
                      href={`https://solscan.io/tx/${claim.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt className="inline-block align-middle text-gray-500 mr-2" />
                      {claim.signature}{" "}

                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>




  );
}

export default GetClaims;
