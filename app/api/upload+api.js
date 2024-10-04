import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@env";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const options = {
  upload_preset: "production",
  unsigned: true,
};

export const POST = async (req, res) => {

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({
        ok: false,
        message: "No file specified",
      }), { status: 404 });
    };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return new Response(JSON.stringify({
      ok: true,
      message: "File uploaded successfully",
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    }), { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return new Response(JSON.stringify({
      ok: false,
      message: "Internal server error uploading file",
    }), { status: 500 });
  };
};
