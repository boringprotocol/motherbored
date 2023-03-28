// types.ts
export type User = {
  id: string;
  wallet: string;
  polygon_wallet?: string;
  ln_address?: string;
  name?: string;
  bio?: string;
  role?: string;
  image?: string;
  publicProfile: boolean;
  peers: Peer[];
  accountHistory: AccountHistory[];
  Claim: Claim[];
};

export type Peer = {
  id: string;
  publicKey: string;
  lastSeen: Date;
};

export type AccountHistory = {
  id: string;
  date: Date;
  amount: number;
};

export type Claim = {
  id: string;
  title: string;
  date: Date;
};
