import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (
  file,
  folder,
  height,
  quality
) => {
  const options = { folder };

  // If height is provided, add it
  if (height) {
    options.height = height;
  }

  // If quality is provided, add it
  if (quality) {
    options.quality = quality;
  }

  // Automatically detect file type
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};