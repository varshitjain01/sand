const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded" });
        }
        // Function to handle the stream upload to Cloudinary
const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        // Use streamifier to convert file buffer to a stream
        // The implementation to use streamifier and pipe the buffer to the stream is missing from the image, but this is the necessary setup:
         streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

//call the streamupload function
const result = await streamUpload(req.file.buffer);

// Respond with the uploaded image URL
res.json({ imageUrl: result.secure_url });

    } catch (error) {
        console.error(error);
res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;