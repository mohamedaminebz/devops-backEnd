const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceModel = new Schema(
  {
    //NameOfSubCategory
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      photo: { type: String },
      promo: { type: Boolean, required: false, default: false },
      pricePromo: { type: Number, required: false, default: 0 },
      space: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Space",
      },
      Category:{type:String}
    },
  { timestamps: true }  
);

module.exports = mongoose.model("Service", ServiceModel);
const ServiceName = mongoose.modelNames();
module.ServiceName = ServiceName;
    