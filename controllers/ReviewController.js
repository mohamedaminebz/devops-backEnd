const mongoose = require("mongoose");
const UserModel = require("../models/User.model");
const ReviewModel = require("../models/ReviewModel");
const SpaceModel = require("../models/SpaceModel");

const Create = async (req, res) => {
  try {
    const data = req.body;

    const spaceID = await SpaceModel.findOne({ _id: req.params._id });
    const existReview = await ReviewModel.findOne({
      space: req.params._id,
      user: req.user._id,
    });

    if (existReview)
      return res.status(409).json({
        message: "Review already exist ",
        success: false,
      });

    const newReview = new ReviewModel({
      ...data,
      user: req.user._id,
      space: spaceID,
    });
    await newReview.save();

    return res.status(200).send({ newReview });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetAllBySpaceId = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ space: req.params._id });

    return res.status(200).send({ reviews });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};
const checkuserReviewBySpace = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({
      space: req.params._id,
      user: req.user._id,
    });
    if (reviews.length > 0) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};
module.exports = { Create, GetAllBySpaceId, checkuserReviewBySpace };
