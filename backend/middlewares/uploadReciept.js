import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Middleware to upload file to Cloudinary
export const uploadToCloudinary = (folder) => async (req, res, next) => {
  try {
    if (!req.file) return next();

    const streamifier = (await import("streamifier")).default;

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return next(error);
        req.file.cloudinary = result; // Save Cloudinary response in req.file
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    next(err);
  }
};

export default upload;
