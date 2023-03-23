import { useRouter } from "next/router";

export default function AdminMenu() {
  const router = useRouter();
  const { pathname } = router;
  const currentPage = pathname.substring(1);

  function handleChange(value: string) {
    router.push(`/${value}`);
  }

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-outline btn-xs gap-2">
        Admin Menu
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>


      </button>
      <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/accounts-records")}>
            Accounts Records
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/rewards-calculations")}>
            Rewards Calculations
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/shares-function")}>
            Shares Function
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/rewards-table")}>
            Rewards Table
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/settlements")}>
            Settlements
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("admin/epochs")}>
            Epochs
          </a>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={() => handleChange("bore")}>
            $BORE
          </a>
        </li>
      </ul>
    </div>
  );
}
