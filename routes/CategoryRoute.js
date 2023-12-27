const express = require("express");
const {
  getActiveCategoriesWithSubcategories,
  fetchActiveSubCategoriesForSpace,
} = require("../controllers/CategoryController");
const { isUser } = require("../middelwares/VerifToken");
const Categoryrouter = express.Router();

Categoryrouter.get("/Active", getActiveCategoriesWithSubcategories);
Categoryrouter.get(
  "/subCategory/Active/:spaceId",
  isUser,
  fetchActiveSubCategoriesForSpace
);

module.exports = Categoryrouter;
