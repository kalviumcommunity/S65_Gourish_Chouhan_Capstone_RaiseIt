const express = require("express");
const multer = require("multer");
const imagekit = require("../config/imagekit");

const router = express.Router();
const upload = multer();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    res.status(200).json({ url: result.url });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

module.exports = router;