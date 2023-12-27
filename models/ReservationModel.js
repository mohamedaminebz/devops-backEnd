const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationModel = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    //date: { type: Date, required: true },
    //FRINT END chyethat
    startTime: { type: Date, required: true },
    //Calculate duration + startTime
    endTime: { type: Date, required: true },
    specialRequests: { type: String },
    status: {
      type: String,
      default: "CONFIRMED",
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    },
    paymentStatus: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "PAID", "REFUNDED"],
    },
    paymentMethod: { type: String, default: "CASH", enum: ["CARD", "CASH"] },
    numCard: { type: Number, required: false },
    expire: { type: String, required: false },
    code: { type: Number, required: false },

    basket: {
      services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
      totalPrice: { type: Number, required: false },
    },
  },
  { timestamps: true }
);

ReservationModel.pre(/^find/, function (next) {
  this.populate("basket.services");
  this.populate("user");
  this.populate("space");

  next();
});
module.exports = mongoose.model("Reservation", ReservationModel);
const ReservationName = mongoose.modelNames();
module.ReservationName = ReservationName;
