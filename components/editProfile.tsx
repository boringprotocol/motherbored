// /components/editProfile.tsx
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth/core/types';
import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import Toast from './Toast';
import UploadImage from '../components/UploadImage';
import { IoImageOutline, IoPencilOutline, IoPersonOutline } from 'react-icons/io5';

const EditProfile = () => {

    const saveButton = useRef<HTMLButtonElement>(null);

    const session = useSession() as {
        data: Session;
        status: "authenticated";
    };

    const wallet = session?.data?.user?.name || '';
    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [bio, setBio] = useState<string>('')
    const [image, setImage] = useState<string | null>(null);
    const [publicProfile, setPublicProfile] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUserData() {
            if (!wallet) return;

            const response = await fetch(`/api/user/?wallet=${wallet}`)
            const userData = await response.json()

            if (userData.user.publicProfile !== undefined) {
                setPublicProfile(userData.user.publicProfile);
            }

            if (userData.user.name) setName(userData.user.name);
            if (userData.user.id) setId(userData.user.id);
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
            id,
            bio,
            publicProfile,
        };

        try {
            const response = await fetch(`/api/user/?wallet=${wallet}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            toast.success(
                <div className="p-4 prose text-sm">
                    <strong>💃 Success!</strong> Your profile has been updated.
                    <p>
                        {publicProfile ? (
                            <a href={`/a/${id}`} target="_blank" rel="noopener noreferrer">
                                View Public Profile
                            </a>
                        ) : (
                            <em className="text-xs">Your profile is set to private"</em>
                        )}
                    </p>
                </div>
            );

        } catch (error) {
            console.error(error);
        }

    };

    return (
        <>
            <Toast />

            <div className="font-jetbrains mt-12">
                {/* {name} */}
                <form onSubmit={handleSubmit}>
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="">Profile</h3>
                                <p className="mt-1 text-xs">
                                    This information will be displayed publicly so be careful what you share.
                                </p>
                                <a href={`/a/${id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <a>View Public Profile</a>
                                </a>
                            </div>
                        </div>
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                <div className="space-y-6 px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="name" className="block text-xs">
                                                <IoPersonOutline className="inline-block mr-1" /> Display Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="input input-bordered w-full text-xs"
                                                placeholder="Your Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className="block text-xs">
                                            <IoPencilOutline className="inline-block mr-1" /> Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            className="textarea textarea-bordered w-full h-32 text-xs"
                                            placeholder="Your Bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>


                                    <div>
                                        <label htmlFor="image" className="block text-xs">
                                            <IoImageOutline className="inline-block mr-1" /> Profile Image
                                        </label>
                                        <UploadImage setImage={setImage} wallet={wallet} />
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">Make Profile Public</span>
                                            <input
                                                type="checkbox"
                                                id="publicProfile"
                                                checked={publicProfile}
                                                onChange={(e) => setPublicProfile(e.target.checked ? true : false)}
                                                className="checkbox" />
                                        </label>
                                    </div>

                                </div>
                                <div className="px-4 py-3 text-right sm:px-6">
                                    <button
                                        className="btn btn-md btn-outline hover:scale-105 transition-transform duration-200 cursor-pointer"
                                        type="submit"
                                        ref={saveButton}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );


}

export default EditProfile
