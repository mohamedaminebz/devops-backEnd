const mongoose = require("mongoose");
const roles = require("../utils/roles");
const access = require("../utils/access");
const Schema = mongoose.Schema;

const defimg =
  "https://res.cloudinary.com/duchnti5k/image/upload/v1676485990/art_collection/profile_xbzcqu.png";

const UserModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    profilImage: { type: String, default: defimg },
    role: {
      type: String,
      default: roles.ADMIN,
      enum: [roles.ADMIN, roles.CLIENT, roles.COLLABORATOR, roles.SUPER_ADMIN],
    },
    access: {
      type: String,
      default: access.ALL,
      enum: [access.ALL],
    },
    address: { type: String, required: false },
    /////// Collab
    space: { type: Boolean, required: false, default: false },

    spaceID: { type: mongoose.Schema.Types.ObjectId, ref: "Space" },

    //Favories
    favories :  [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }], 
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserModel);
