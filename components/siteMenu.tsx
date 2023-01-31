import { useRouter } from "next/router";

export default function SiteMenu() {
    const router = useRouter();
    const { pathname } = router;
    const currentPage = pathname.substr(1);

  function handleChange(e){
    if (e.target.value === "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V1%22%5D%7D") {
      window.open(e.target.value, "_blank");
    } else if (e.target.value === "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V2%22%5D%7D") {
      window.open("https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V2%22%5D%7D", "_blank");
    } else if (e.target.value === "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22VX%22%5D%7D") {
      window.open("https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22VX%22%5D%7D", "_blank");
    } else {
    // your existing logic for handling local pages
    router.push(`/${e.target.value}`)
  }
 
  }

    return (
      <div>
        <select
          value={currentPage}
          className="mt-1 block w-full rounded-sm bg-boring-white dark:bg-boring-black border-gray-light dark:border-gray-dark py-2 pl-3 pr-10 text-base focus:border-blue focus:outline-none focus:ring-indigo-500 sm:text-xs"
          onChange={(e) => handleChange(e)}
        >
          <option value="" selected={currentPage === '/'}>Home</option>
          <option value="profile" selected={currentPage === 'profile'}>Profile</option>
          <option value="peers" selected={currentPage === 'peers'}>Peers</option>
          <option value="wallet" selected={currentPage === 'wallet'}>Wallet</option>
          <option value="shares-function" selected={currentPage === 'shares-function'}>Shares Function</option>
          <option value="rewards-table" selected={currentPage === 'rewards-table'}>Rewards Table</option>
          <option value="settlements" selected={currentPage === 'settlements'}>Settlements</option>
          <option value="directory" selected={currentPage === 'directory'}>Provider Directory</option>
          <option value="https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V1%22%5D%7D">V1</option>
          <option value="https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V2%22%5D%7D">V2</option>
          <option value="https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22VX%22%5D%7D">VX</option>
          <option value="newpeer?mode=consumer" selected={currentPage === 'newpeer?mode=consumer'}>New Consumer Peer</option>
          <option value="newpeer?mode=provider" selected={currentPage === 'newpeer?mode=provider'}>New Provider Peer</option>
          <option value="nostr" selected={currentPage === 'nostr'}>Nostr</option>
          <option value="asteroids" selected={currentPage === 'asteroids'}>Asteroids</option>
        </select>
      </div>
    )
  }
