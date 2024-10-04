import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const DELETE = async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.json({
      ok: false,
      status: 404,
      message: "No public_id provided",
    });
  }

  try {
    const response = await cloudinary.v2.uploader.destroy(public_id);

    if (!response.result !== 'ok') {
      return res.json({
        ok: false,
        status: 500,
        message: "Image could not be deleted",
      });
    }

    return res.json({
      ok: true,
      status: 202,
      message: "Image deleted successfully",
      data: response,
    });
  } catch (error) {
    console.log("Error deleting image", error);
    return res.json({
      ok: false,
      status: 500,
      message: "Internal server error deleting image",
    });
  }
};
