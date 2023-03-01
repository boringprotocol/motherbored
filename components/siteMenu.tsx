import { useRouter } from "next/router";

export default function SiteMenu({ motherboredApp, boringProtocol, motherboredDocs }: any) {
  const router = useRouter();
  const { pathname } = router;
  const currentPage = pathname.substring(1);

  const V1_URL = "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V1%22%5D%7D";
  const V2_URL = "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22V2%22%5D%7D";
  const VX_URL = "https://magiceden.io/marketplace/boperator?attributes=%7B%22Boperator%22%3A%5B%22VX%22%5D%7D";
  const WEBSITE_URL = `${boringProtocol}`;
  // need to figure out the best way to handle this link shit

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    switch (e.target.value) {
      case V1_URL:
      case V2_URL:
      case VX_URL:
      case WEBSITE_URL:
        window.open(e.target.value, "_blank");
        break;
      default:
        router.push(`/${e.target.value}`);
    }
  }

  return (
    <>
      <div>
        <select
          value={currentPage}
          onChange={(e) => handleChange(e)}
          className="block w-full rounded-sm bg-boring-white dark:bg-boring-black border-gray-light dark:border-gray-dark py-3 pl-3 pr-10  focus:border-blue focus:outline-none focus:ring-indigo-500 text-xs"
        >
          <option value="">
            Dashboard
          </option>
          <option value="profile/edit">
            Edit Profile
          </option>
          <option value="profile">
            Profile
          </option>
          <option value="wallet">
            Wallet
          </option>
          <option value="{V1_URL}">V1</option>
          <option value="{V2_URL}">V2</option>
          <option value="{VX_URL}">VX</option>
          <option value="newpeer?mode=consumer&consumer_platform=Motherbored">New Consumer Peer</option>
          <option value="newpeer?mode=provider">New Provider Peer</option>
          <option value="404">404</option>
          <option value="{WEBSITE_URL}">Website</option>
        </select>
      </div>


      <div>
        <select
          value={currentPage}
          onChange={(e) => handleChange(e)}
          className="block w-full rounded-sm bg-boring-white dark:bg-boring-black border-gray-light dark:border-gray-dark py-3 pl-3 pr-10  focus:border-blue focus:outline-none focus:ring-indigo-500 text-xs"
        >
          <option value="admin/accounts-records">
            Accounts Records
          </option>
          <option value="admin/rewards-calculations">
            Rewards Calculations
          </option>
          <option value="admin/shares-function">
            Shares Function
          </option>
          <option value="admin/rewards-table">
            Rewards Table
          </option>
          <option value="admin/settlements">
            Settlements
          </option>
          <option value="admin/epochs">
            Epochs
          </option>
        </select>
      </div>
    </>
  )
}
