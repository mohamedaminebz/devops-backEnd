const mongoose = require("mongoose");
const { SpaceCategories } = require("../utils/categories");
const Schema = mongoose.Schema;

const SpaceModel = new Schema(
  {
    label: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: {
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    photos: [{ type: String, required: false }],
    description: { type: String, required: true },

    state: {
      type: String,
      default: "PENDING",
      enum: ["REJECTED", "APPROVED", "PENDING"],
    },

    openingHours: [
      {
        day: {
          type: Number,
          min: 0,
          max: 6,
          required: false,
        },
        openingTime: { type: String, required: false },
        closingTime: { type: String, required: false },
        opened: { type: Boolean, required: false },
      },
    ],
    socialMediaLinks: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    amenities: { type: String },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ],

    GPS: {
      lat: { type: Number },
      lng: { type: Number },
      title: { type: String },
    },
  },
  {
    timestamps: true,
    default: {
      GPS: {
        title: "$label",
      },
    },
  }
);
SpaceModel.pre(/^find/, function (next) {
  this.populate("categories").populate("owner");
  next();
});
module.exports = mongoose.model("Space", SpaceModel);
const SpaceName = mongoose.modelNames();
module.SpaceName = SpaceName;
