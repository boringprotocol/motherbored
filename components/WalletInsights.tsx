import { User } from '../types';

interface Props {
  user: User;
}

const WalletInsights = ({ user }: Props) => {

  return (
    <>
      <h1 className="text-sm my-6">Wallet Insights</h1>
      <p>You have bla bla bla</p>
      {user.name}
    </>
  );
};


export default WalletInsights;
