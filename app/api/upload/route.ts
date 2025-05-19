import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/clounary";

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json();

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error },
      { status: 500 }
    );
  }
}
