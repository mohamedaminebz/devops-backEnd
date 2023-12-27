const express = require("express");
const router = express.Router();
const verifToken = require("../middelwares/VerifToken");
const SpaceController = require("../controllers/SpaceController");
const cloudinary = require("../functions/CloudinaryUploadImage");

router.post(
  "/add",
  verifToken.isUser,
  cloudinary.uploadImage,
  SpaceController.Create
);
router.put("/update/:_id", verifToken.isUser, SpaceController.Update);

router.post("/toggleFavory", verifToken.isUser, SpaceController.ToggleFavory);
router.get("/userFavory/:id", verifToken.isUser, SpaceController.fetchMyFavaries);

module.exports = router;
