const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(503).json({ message: "Cloudinary upload is not configured" });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "raiseit", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    res.status(200).json({ url: uploadResult.secure_url, publicId: uploadResult.public_id });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

router.use((error, req, res, next) => {
  res.status(400).json({ message: error.message || "Image upload failed" });
});

module.exports = router;
