import { signOut, useSession } from "next-auth/react";
import { IoArrowDownOutline, IoChevronDownOutline, IoEllipsisVerticalOutline, IoLogOutOutline, IoPersonOutline, IoWalletOutline } from "react-icons/io5";

const AccountCard = () => {
    const { data: session } = useSession();

    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        signOut();
    };

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <p className="text-xs text-boring-black dark:text-boring-white truncate">
                    {session?.user && (
                        <>
                            {session.user.email ?? session.user.name}
                            {/* <span>oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V</span> */}
                        </>
                    )}
                </p>
                <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost btn-sm gap-2">
                        <span className="sr-only">Open options</span>
                        <IoEllipsisVerticalOutline className="h-4 w-4" aria-hidden="true" />



                    </button>
                    <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a href="/profile/edit" className="dropdown-item">
                                <IoPersonOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                Edit Profile
                            </a>
                        </li>
                        <li>
                            <a href="/wallet" className="dropdown-item">
                                <IoWalletOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                Wallet
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={handleSignOut} className="dropdown-item">
                                <IoLogOutOutline className="mr-3 h-4 w-4" aria-hidden="true" />
                                Sign Out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;
