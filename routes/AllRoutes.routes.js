const express = require("express");
const router = express.Router();
const UserRoute = require("./user.routes");
const PartnershipRoute = require("./partnershiip.routes");
const BasketRouter = require("./basketRoute");
const Categoryrouter = require("./CategoryRoute");
const SpaceRoute = require("./space.routes");
const ReviewRoute = require("./ReviewRoutes");
const ReservationRouter = require("./reservationRoute");

const dynamicRouter = require("./ROUTE");
const ServiceRouter = require("./ServiceRoute");

router.use("/user", UserRoute);
router.use("/partnership", PartnershipRoute);
router.use("/space", SpaceRoute);
router.use("/review", ReviewRoute);

router.use("/api", dynamicRouter);
router.use("/Basket", BasketRouter);
router.use("/Category", Categoryrouter);
router.use("/Service", ServiceRouter);
router.use("/Reservation", ReservationRouter);

module.exports = router;
