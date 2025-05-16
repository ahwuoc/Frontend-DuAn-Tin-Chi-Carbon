"use client";
import { useState } from "react";

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

export default function UploadForm() {
    const [fileUrl, setFileUrl] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset");

        const isImage = file.type.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        setFileUrl(data.secure_url);
    };

    // Helper check extension
    const isImageFile = (url: string) => url.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPdfFile = (url: string) => url.match(/\.pdf$/i);

    return (
        <div>
            <input type="file" onChange={handleUpload} />

            {fileUrl && (
                <>
                    {isImageFile(fileUrl) ? (
                        <img src={fileUrl} alt="Uploaded" width={300} />
                    ) : isPdfFile(fileUrl) ? (
                        <iframe
                            src={fileUrl}
                            width="100%"
                            height="600px"
                            title="PDF Preview"
                        />
                    ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            View Uploaded File
                        </a>
                    )}
                </>
            )}
        </div>
    );
}
