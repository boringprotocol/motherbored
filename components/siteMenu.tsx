import { useRouter } from "next/router";

export default function SiteMenu() {

    const router = useRouter();

  function handleChange(e: { target: { value: any; }; }){
    router.push(`/${e.target.value}`)
  }

    return (
      <div>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={handleChange}
        >
          <option value="settlements">settlements</option>
          <option value="wallet">account</option>
          <option value="bug">bug</option>
          <option value="sandbox">sandbox</option>
          <option value="newpeer">newpeer</option>
        </select>
      </div>
    )
  }
