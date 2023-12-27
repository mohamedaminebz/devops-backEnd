const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BasketModel = new Schema(
  {
    service: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service"},
    ], 
     owner : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ,
    totalPrix : {type:Number}
    },

  
  
  { timestamps: true }
);

module.exports = mongoose.model("Basket", BasketModel);
const BasketName = mongoose.modelNames();
module.BasketName = BasketName;
