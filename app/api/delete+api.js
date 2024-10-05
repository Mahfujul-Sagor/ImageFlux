import {v2 as cloudinary} from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const DELETE = async (req, res) => {
  const { public_id } = await req.json();

  if (!public_id) {
    return new Response(JSON.stringify({
      ok: false,
      message: "No public_id provided",
    }), { status: 404 });
  }

  try {
    const response = await cloudinary.uploader.destroy(public_id);

    if (response.result !== 'ok') {
      console.error(`Failed to delete image with public_id: ${public_id}`);
      return new Response(JSON.stringify({
        ok: false,
        message: "Internal server error deleting file",
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      ok: true,
      message: "File deleted successfully",
      data: response,
    }), { status: 202 });
  } catch (error) {
    console.log("Error deleting image", error);
    return new Response(JSON.stringify({
      ok: false,
      message: "Internal server error deleting file",
    }), { status: 500 });
  }
};
