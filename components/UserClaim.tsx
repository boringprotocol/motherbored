import { useSession } from "next-auth/react";

const UserClaim = () => {
    const { data: session } = useSession();

    return (

        <>
            {session?.user && (
                <>
                    {session.user.name}

                </>
            )}

        </>
    );
}

export default UserClaim
