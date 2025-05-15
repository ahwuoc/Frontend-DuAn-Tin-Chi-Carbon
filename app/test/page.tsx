"use client";
import { useState } from "react";
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
export default function UploadForm() {
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setImageUrl(data.secure_url); // Link ảnh đã upload
    };

    return (
        <div>
            <input type="file" onChange={handleUpload} />
            {imageUrl && (
                <img src={imageUrl} alt="Uploaded" width={300} />
            )}
        </div>
    );
}
