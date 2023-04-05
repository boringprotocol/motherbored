// /components/editProfile.tsx
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth/core/types';
import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import Toast from './Toast';
import UploadImage from '../components/UploadImage';
import { IoImageOutline, IoPencilOutline, IoPersonOutline } from 'react-icons/io5';
import { MarkdownPreview } from './MarkdownPreview';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const EditProfile = () => {

    const charLimit = 500;

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
    const [showMarkdownPreview, setMarkdownPreview] = useState(false);

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

    useEffect(() => {
        if (bio.length > charLimit) {
            setBio((prevBio) => prevBio.slice(0, charLimit));
        }
    }, [bio]);


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
                            <a className="link" href={`/a/${id}`} target="_blank" rel="noopener noreferrer">
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



                                < div >

                                    <UploadImage setImage={setImage} wallet={wallet} />
                                </div>


                                <a href={`/a/${id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <a className="link">View Public Profile</a>
                                </a>

                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Make Profile Public</span>
                                        <input
                                            type="checkbox"
                                            id="publicProfile"
                                            checked={publicProfile}
                                            onChange={(e) => setPublicProfile(e.target.checked ? true : false)}
                                            className="checkbox checkbox-xs" />
                                    </label>
                                </div>
                            </div>


                        </div>
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                <div className="space-y-6 px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="name" className="block text-xs mb-2">
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

                                    <div className="divider"></div>
                                    <div className=''>




                                    </div>

                                    <div className='form-control'>
                                        {/* <label htmlFor="bio" className="block text-xs">
                                            <IoPencilOutline className="inline-block mr-1" /> Bio
                                        </label>
                                        <label htmlFor="bio" className="block text-xs">
                                            <IoPencilOutline className="inline-block mr-1" /> Bio
                                        </label> */}
                                        <label className="label text-xs">
                                            <span className="label-text text-xs"><IoPencilOutline className="inline-block" /> Bio</span>
                                            <span className="label-text-alt">Markdown Support <label htmlFor="my-modal-6" className='btn btn-xs btn-ghost btn-circle'><BsFillQuestionCircleFill /></label></span>
                                        </label>

                                        <textarea
                                            id="bio"
                                            className="textarea textarea-bordered w-full h-32 text-sm"
                                            placeholder="Your Bio"
                                            value={bio}
                                            maxLength={charLimit}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                        <div className="text-right text-xs text-base-300 my-2">
                                            {bio.length}/{charLimit} Chars
                                        </div>
                                        <a
                                            className={`btn btn-xs btn-outline`}
                                            onClick={() => setMarkdownPreview(!showMarkdownPreview)}
                                        >
                                            {showMarkdownPreview ? <IoMdEye className='mr-2' /> : <IoMdEyeOff className='mr-2' />} Preview
                                        </a>
                                    </div>



                                    {showMarkdownPreview && (

                                        <><div className="mt-24 card card-bordered p-4">
                                            <h3 className='text-left mb-2 text-base-300'>Markdown Preview</h3>
                                            <MarkdownPreview value={bio} />
                                        </div>
                                        </>

                                    )}

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
            </div >

            {/* Put this part before </body> tag */}
            < input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Markdown Support</h3>
                    <p className="py-4">The <span className="font-extrabold">strong</span> dog was <a className="link" href="https://youtube.com/shorts/ammQh9u-c9E?feature=share">cathandled</a> by a <em>dangerous</em> animal. </p>
                    <ul className="py-4">
                        <li>**bold text**</li>
                        <li>_italicised text_</li>
                        <li>Link: [Link Name](https://example.com)</li>
                        <li>etc...</li>
                    </ul>
                    <a className="link" href="https://github.com/tchapi/markdown-cheatsheet">Markdown Cheatsheet</a>

                    <div className="modal-action">
                        <label htmlFor="my-modal-6" className="btn">Ok</label>
                    </div>
                </div>
            </div>


        </>
    );


}

export default EditProfile
