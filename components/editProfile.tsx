import { Session } from 'next-auth';
import { useSession } from 'next-auth/react'
import React, { useRef, useState, useEffect } from 'react'
import { BsLightning } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from "next-themes";
import { IoImageOutline, IoNavigateOutline, IoPencilOutline, IoPersonOutline } from 'react-icons/io5';
import Waiting from './art/waiting';

const EditProfile = () => {

    const { theme } = useTheme();

    const saveButton = useRef<HTMLButtonElement>(null);

    const session = useSession() as {
        data: Session;
        status: "authenticated";
    };

    const wallet = session?.data?.user?.name || '';
    const [name, setName] = useState<string>('')
    const [bio, setBio] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const [publicProfile, setPublicProfile] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUserData() {
            if (!wallet) return;

            const response = await fetch(`/api/user/?wallet=${wallet}`)
            const userData = await response.json()

            // console.log(userData)

            if (userData.user.publicProfile !== undefined) {
                setPublicProfile(userData.user.publicProfile);
            }

            if (userData.user.name) setName(userData.user.name);
            if (userData.user.bio) setBio(userData.user.bio);
            if (userData.user.image) setImage(userData.user.image);
            if (userData.user.publicProfile) setPublicProfile(userData.user.publicProfile);
        }

        fetchUserData()
    }, [wallet])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const updatedUserData = {
            name,
            bio,
            image,
            publicProfile
        };
        try {
            const response = await fetch(`/api/user/?wallet=${wallet}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });
            const responseJson = await response.json();
            console.log("This profile is public:", publicProfile);
            console.log(updatedUserData)
            console.log(responseJson);

            // Display the toast message
            toast.success(
                <>
                    <p className="text-lg">Your Profile has been updated!</p><br /><br />
                    <a href="https://google.com" className="toast-link text-boring-blue">See your updated profile</a>
                    <Waiting />
                </>,
                {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme === "light" ? "light" : "dark"
                }
            );

        } catch (error) {
            console.error(error);
        }

        //        const saveButton = useRef<HTMLButtonElement>(null);
        if (saveButton.current) {
            saveButton.current.focus();
            return;

        }
    };

    return (
        <>
            <ToastContainer />
            <div className="font-jetbrains">
                <h1 className="mt-6 text-md">Update Profile - {wallet}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4 w-100 sm:w-2/3 md:w-1/2 xl:w-1/2 rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-boring-blue focus-within:ring-boring-blue">
                        <label htmlFor="name" className="block text-xs  text-gray-light mb-1">
                            <IoPersonOutline className='float-left mr-1' /> Display Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full border-0 p-0 text-gray-dark dark:text-boring-white placeholder-gray bg-boring-white dark:bg-boring-black focus:ring-0 text-xs"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 w-100 sm:w-2/3 md:w-3/5 lg:w-2/3  xl:w-1/2 rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-boring-blue focus-within:ring-boring-blue">
                        <label htmlFor="bio" className="block text-xs  text-gray-light mb-1">
                            <IoPencilOutline className='float-left mr-1' /> Bio
                        </label>
                        <textarea
                            id="bio"
                            className="block h-32  w-full border-0 p-0 text-gray-dark dark:text-boring-white placeholder-gray bg-boring-white dark:bg-boring-black focus:ring-0 text-xs"
                            placeholder="Your Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 w-100 sm:w-2/3 md:w-1/2 xl:w-1/3  rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-boring-blue focus-within:ring-boring-blue">
                        <label htmlFor="image" className="block text-xs  text-gray-light mb-1">
                            <IoImageOutline className='float-left mr-1' /> Profile Image
                        </label>
                        <input
                            type="text"
                            id="image"
                            className="block w-full border-0 p-0 text-gray-dark dark:text-boring-white placeholder-gray bg-boring-white dark:bg-boring-black focus:ring-0 text-xs"
                            placeholder="Image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 w-100 sm:w-2/3 md:w-1/2 xl:w-1/3  rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-boring-blue  focus-within:ring-boring-blue">
                        <label htmlFor="name" className="block text-xs  text-gray-light mb-1">
                            <BsLightning className='float-left mr-1' /> LN Address
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="ln-address"
                            className="block w-full border-0 p-0 text-gray-lightest placeholder-gray-dark dark:placeholder-gray-lightest bg-boring-white dark:bg-boring-black focus:ring-0 text-xs"
                            placeholder="fran@getalby.com"
                        />
                    </div>

                    <div className="mt-4 w-100 sm:w-2/3 md:w-3/5 lg:w-2/3  xl:w-1/2  rounded-sm border border-gray-light dark:border-gray-dark px-3 py-3 shadow-sm focus-within:border-boring-blue  focus-within:ring-boring-blue">
                        <label htmlFor="name" className="block text-xs  text-gray-light mb-1">
                            <IoNavigateOutline className='float-left mr-1' /> NIP-05
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            placeholder="fran"
                            className="float-left w-2/3 rounded-none rounded-l-md border-gray text-gray dark:text-gray-lightest placeholder-gray-dark dark:placeholder-gray-lightest bg-boring-white dark:bg-boring-black focus:ring-0 text-xs py-3"
                        />
                        <span className="inline-flex w-1/3 rounded-r-md border border-l-0 border-gray bg-gray px-3 text-gray-light text-xs py-3">
                            @boring.surf
                        </span>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="publicProfile">Show Public Profile:</label>
                        <input type="checkbox" id="publicProfile" checked={publicProfile} onChange={e => setPublicProfile(e.target.checked ? true : false)} /><a href='#' className='text-xs text-gray-light ml-2'>What is this?</a> Your profile will be visible to anyone on the internet.
                    </div>
                    <button className=" transition duration-200 ease-in-out transform  hover:scale-105 cursor-pointer my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-4 py-3 text-boring-black dark:text-gray-light hover:bg-boring-white hover:border-white hover:opacity-90 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm" type="submit" ref={saveButton}>Save</button>
                </form>
            </div>
        </>
    )
}

export default EditProfile
