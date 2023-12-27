const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../utils/cloudinaryConfig");


// Set up the multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      return {
        resource_type: "auto",
        folder: "Booking_Platform",
        public_id: file.originalname,
      };
    },
  });
  
  // Create the multer middleware for handling file uploads
  const upload = multer({ storage: storage }).single("file");
  
  // Middleware function to handle the image upload
  const uploadImageToCloudinary = (req, res, next) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          throw new Error("Error uploading image");
        }
  
        req.body.photo = req?.file?.path;
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading image" });
    }
  };
  
  
  module.exports = uploadImageToCloudinary;