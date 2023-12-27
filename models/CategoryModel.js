const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryModel = new Schema(
  {
    label: { type: String, required: true },
    subCategory: [
      {
        label: { type: String, required: false },
        status: {
          type: String,
          required: false,
          enum: ["ACTIVE", "INACTIVE"],
          default: "ACTIVE",
        },
      },
    ],
    status: {
      type: String,
      required: false,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategoryModel);
const CategoryName = mongoose.modelNames();
module.CategoryName = CategoryName;
