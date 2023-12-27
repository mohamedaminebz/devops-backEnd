const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriesModel = new Schema(
  {
    space :  [{ type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true }], 
    user :  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  },
  { timestamps: true }
);

FavoriesModel.pre(/^find/, function (next) {
    this.populate("user").populate("space");
    next();
  }); 
  
module.exports = mongoose.model("Favories", FavoriesModel);
const FavoriesName = mongoose.modelNames();
module.FavoriesName = FavoriesName;

