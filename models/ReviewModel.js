const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewModel = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
ReviewModel.pre(/^find/, function (next) {
  this.populate("user").populate("space");
  next();
});
module.exports = mongoose.model("Review", ReviewModel);
const ReviewName = mongoose.modelNames();
module.ReviewName = ReviewName;
