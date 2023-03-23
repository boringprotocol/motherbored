// /components/UploadImage.tsx
import React, { useState, useEffect } from "react";

interface UploadImageProps {
  setImage: (url: string) => void;
  wallet: string;
}

export default function UploadImage({ setImage, wallet }: UploadImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchImageUrl() {
      if (!wallet) {
        return;
      }

      try {
        const res = await fetch(`/api/profile-image-url?wallet=${wallet}`);
        if (res.ok) {
          const { url } = await res.json();
          setImageUrl(url);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    }

    fetchImageUrl();
  }, [wallet, imageUploaded]);

  useEffect(() => {
    if (imageUploaded) {
      const fetchNewImageUrl = async () => {
        try {
          const res = await fetch(`/api/profile-image-url?wallet=${wallet}`);
          if (res.ok) {
            const { url } = await res.json();
            setImageUrl(url);
          }
        } catch (error) {
          console.error("Error fetching new image URL:", error);
        }
      };

      fetchNewImageUrl();
    }
  }, [imageUploaded, wallet]);


  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${wallet}.${fileExtension}`;

    const res = await fetch(
      `/api/upload-url?wallet=${wallet}&fileExtension=${fileExtension}`
    );

    if (res.status === 413) {
      console.error("File too large.");
      return;
    }

    const { url, fields, fileExtension: newFileExtension } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
      const imageUrl = `https://motherbored-public-profile.s3.amazonaws.com/users/${wallet}/${fileName}`;
      setImage(`/api/${fileName}`);
      setImageUrl(imageUrl);

      // Call the API to update the user's image in the database
      const res = await fetch('/api/update-user-image', {
        method: 'POST',
        body: JSON.stringify({ wallet, imageUrl }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        console.log('User image updated successfully!');
        setImageUploaded(true);
      } else {
        console.error('Error updating user image:', res.statusText);
      }
    } else {
      console.error("Upload failed.");
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading profile image...</p>
      ) : (
        <div className="flex justify-center">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={imageUrl || "/default-avatar.png"} alt="Profile" />

            </div>
          </div>
        </div>

      )}
      <input onChange={uploadPhoto} type="file" accept="image/*" />
    </>
  );
}
