//const { cloudinary } = require("../utils/cloudinaryConfig");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;

const bookingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      resource_type: "auto",
      folder: "Booking_Platform",
      public_id: file.originalname,
    };
  },
});
const uploadImage = multer({
  storage: bookingStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
}).array("photos", 5);
module.exports = { uploadImage };
