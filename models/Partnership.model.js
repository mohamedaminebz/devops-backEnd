const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartnershipModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true, //unique: true
   },
    addressSpace: {
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    spaceName: { type: String, required: true },
    service: { type: String, required: true },
    state: {
      type: String,
      default: "NOT_APPROVED",
      enum: ["NOT_APPROVED", "APPROVED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partnership", PartnershipModel);
const PartenershipName = mongoose.modelNames();
module.PartenershipName = PartenershipName;
