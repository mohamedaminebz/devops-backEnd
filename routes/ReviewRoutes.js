const express = require("express");
const router = express.Router();
const verifToken = require("../middelwares/VerifToken");
const ReviewController = require("../controllers/ReviewController");

router.post("/add/:_id", verifToken.isUser, ReviewController.Create);
router.get("/getAll/:_id", ReviewController.GetAllBySpaceId);
router.get(
  "/checkuserReviewBySpace/:_id",
  verifToken.isUser,
  ReviewController.checkuserReviewBySpace
);

module.exports = router;
