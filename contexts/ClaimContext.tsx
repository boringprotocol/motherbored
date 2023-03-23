// /contexts/ClaimContext.tsx
import { createContext, useContext, useState } from "react";

interface ClaimContextType {
  claimUpdated: boolean;
  setClaimUpdated: (value: boolean) => void;
}

interface ClaimContextProviderProps {
  children: React.ReactNode;
}

const ClaimContext = createContext<ClaimContextType>({
  claimUpdated: false,
  setClaimUpdated: () => { },
});

export function useClaimContext() {
  return useContext(ClaimContext);
}


export const ClaimContextProvider = ({ children }: ClaimContextProviderProps) => {
  const [claimUpdated, setClaimUpdated] = useState(false);

  return (
    <ClaimContext.Provider value={{ claimUpdated, setClaimUpdated }}>
      {children}
    </ClaimContext.Provider>
  );
};
