const express = require("express");
const ServiceRouter = express.Router();
const verifToken = require("../middelwares/VerifToken");
const { isCOLLABORATOR } = require("../utils/roles");
const { fetchServicesBySpace, makePromotion, resetPrice, fetchServicesWithSpace } = require("../controllers/ServiceController");

ServiceRouter.get("/Space/:spaceId",fetchServicesBySpace);
ServiceRouter.put("/promotion",makePromotion);
ServiceRouter.put("/reset",resetPrice);
ServiceRouter.get("/client/services/:category",fetchServicesWithSpace);


module.exports = ServiceRouter;
