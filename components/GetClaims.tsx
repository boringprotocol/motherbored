// /components/GetClaims.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Claim {
  id: string;
  amount: number;
  claimed: boolean;
}

interface Props {
  amount: number;
}

function GetClaims(props: Props) {
  const { amount } = props;

  const [state, setState] = useState<{
    claims: Claim[];
    error: string | null;
  }>({
    claims: [],
    error: null,
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
            setState({ claims: result, error: null });
          },
          (error) => {
            setState({ claims: null, error: "Error loading claims" });
          }
        );
    }
  }, [session, status]);

  async function handleProcessClaim(id: string) {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      } else {
        console.error("Unexpected error");
      }
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
      {state.claims.map((claim: Claim) => (
        <div key={claim.id}>
          {!claim.claimed && (
            <>
              <p className="mt-1 truncate text-sm text-gray-500">{claim.amount}, {claim.id}</p>
              <button className="outline p-2" onClick={() => handleProcessClaim(claim.id)}>
                Claim button
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default GetClaims;
