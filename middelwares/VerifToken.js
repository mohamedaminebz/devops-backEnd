const jwt = require("jsonwebtoken");
const userModel = require("../models/User.model");
const { roles } = require("../utils/roles");

const checkToken = (roles) => async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user;
    if (!roles) {
      user = await userModel.findOne({
        _id: decoded._id,
      });
    } else {
      user = await userModel.findOne({
        _id: decoded._id,
        role: roles,
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, Message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, Message: "Unauthorized" });
  }
};

const isAdmin = checkToken(roles.ADMIN);
const isCollaborator = checkToken(roles.COLLABORATOR);
const isSuperAdmin = checkToken(roles.SUPER_ADMIN);
const isClient = checkToken(roles.CLIENT);
const isUser = checkToken();

module.exports = { isAdmin, isCollaborator, isSuperAdmin, isClient, isUser };
