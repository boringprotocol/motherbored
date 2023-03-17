// /components/GetClaims.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import BopLogo from "./art/bopLogo";

interface Claim {
  updatedAt: string;
  signature: string;
  id: string;
  amount: number;
  claimed: boolean;
}

// Define a new type for the appearingClaims and disappearingClaims state properties
type TransitionState = {
  [claimId: string]: boolean;
};

function GetClaims() {
  const [state, setState] = useState<{
    claims: Claim[];
    loadingClaims: { [claimId: string]: boolean };
    error: string | null;
    signature: string | null;
    signatures: { [claimId: string]: string | null }; // Add this line
    disappearingClaims: TransitionState;
    appearingClaims: TransitionState;

  }>({
    claims: [],
    loadingClaims: {},
    error: null,
    signature: null,
    signatures: {}, // Add this line
    disappearingClaims: {}, // Add this line
    appearingClaims: {}, // Add this line
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
            }, 100); // Adjust this value if necessary
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
  }, [session, status]);


  async function handleProcessClaim(id: string) {
    try {
      setState((prevState) => ({
        ...prevState,
        loadingClaims: { ...prevState.loadingClaims, [id]: true },
      }));

      const claim = state.claims?.find((c) => c.id === id);
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
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process claim");
      }

      const result = await response.json();
      console.log(result);


      if (result.success) {
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
      <h3 className="text-sm mt-6 mb-2">Platform Incentive Rewards</h3>

      {state.claims
        .filter((claim: Claim) => !claim.claimed)
        .map((claim: Claim) => (
          <div
            className={classNames(
              "border p-4 mb-4 border-gray-lightest",
              state.disappearingClaims[claim.id] ? "opacity-0" : "opacity-100",
              "transition-opacity duration-1000",
              "dark:border-gray-darker"
            )}
            key={claim.id}
            style={{
              backgroundColor: state.disappearingClaims[claim.id]
                ? "#edebeb" // Light mode flash color
                : "inherit",
            }}>
            <>
              <p className="mt-1 truncate text-sm text-gray dark:text-gray">

                {/* <span className="h-5 w-5 float-left">
                <BopLogo />
              </span> */}

                {claim.amount} $BOP</p>

              <button
                className="mt-4 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-lightest hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
                onClick={() => handleProcessClaim(claim.id)}
                disabled={state.loadingClaims[claim.id]}
              >
                {state.loadingClaims[claim.id] ? (
                  <>
                    <span className="float-left pr-2">
                      <FontAwesomeIcon icon={faSpinner} spin /></span> Claiming...
                  </>
                ) : (
                  "Claim"
                )}
              </button>

            </>

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
        ))}

      <div>
        <h3 className="text-sm mt-6 mb-2">Claimed Rewards</h3>

        <div className="text-xs">
          {state.claims
            .filter((claim: Claim) => claim.claimed)
            .map((claim: Claim) => (
              <div
                className={classNames(
                  "border p-4 mb-4",
                  state.appearingClaims[claim.id] ? "opacity-100" : "opacity-0",
                  "transition-opacity duration-1000",
                  "dark:border-gray-darker"
                )}
                key={claim.id}
                style={{
                  backgroundColor: state.appearingClaims[claim.id]
                    ? "transparent" // Dark mode flash color
                    : "inherit",
                }}>
                <p className="py-2 truncate text-xs text-gray dark:text-gray">
                  {claim.updatedAt}<br />
                  {claim.amount} $BOP&nbsp;
                  <a
                    href={`https://solscan.io/tx/${claim.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {claim.signature}
                  </a>
                </p>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
}

export default GetClaims;
