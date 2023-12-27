const express = require("express");
const BasketRouter = express.Router();
const verifToken = require("../middelwares/VerifToken");
const { getBasketByOwner, addServiceToBasket, removeServiceFromBasket } = require("../controllers/BasketController");

BasketRouter.get("/User", verifToken.isClient,getBasketByOwner);
BasketRouter.post("/User", verifToken.isClient,addServiceToBasket);
BasketRouter.delete("/User/:serviceId", verifToken.isClient,removeServiceFromBasket);

module.exports = BasketRouter;
