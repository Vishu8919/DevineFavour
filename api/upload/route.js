// /api/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run multer in a promise
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

// Main POST handler
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Cloudinary using stream
  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(buffer);
    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
