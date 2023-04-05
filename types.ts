// types.ts
export type User = {
  website: string;
  id: string;
  wallet: string;
  polygon_wallet?: string;
  ln_address?: string;
  name?: string;
  bio?: string;
  image?: string;
  publicProfile: boolean;
  peers: Peer[];
  accountHistory: AccountHistory[];
  claim: Claim[];
  drips: Drip[];
};

export type Peer = {
  country_code: string;
  kind: string;
  userId: string;
  name: string;
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

export type Drip = {
  id: string;
  name: string;
  description: string;
  tokenMintAddress: string;
  tokenDecimals: number;
  startDate: string;
  endDate: string;
  userId: string;
  approved: boolean;
};
