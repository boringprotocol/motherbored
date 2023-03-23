import { useRouter } from "next/router";

export default function SiteMenu({ boringProtocol }: any) {
  const router = useRouter();
  const { pathname } = router;
  const currentPage = pathname.substring(1);

  function handleChange(value: string) {
    switch (value) {
      case boringProtocol:
        window.open(value, "_blank");
        break;
      default:
        router.push(`/${value}`);
    }
  }

  return (
    <div className="dropdown">
      {/* {currentPage} */}
      <button className="btn btn-outline btn-xs gap-2">
        Site Menu
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("")}>
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("profile/edit")}>
            Edit Profile
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("profile")}>
            Profile
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("wallet")}>
            Wallet
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("newpeer?mode=consumer&consumer_platform=Motherbored")}>
            New VPN Client
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("newpeer?mode=provider")}>
            New Provider Peer
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("404")}>
            404
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange(boringProtocol)}>
            Website
          </a>
        </li>
      </ul>
    </div>
  );
}
