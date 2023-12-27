const express = require("express");
const ReservationRouter = express.Router();
const verifToken = require("../middelwares/VerifToken");
const {
  getAvailableTimeOnAdate,
  getSpaceReservations,
  Create,
  toggleReservationStatus,
  getClientReservations,
} = require("../controllers/ReservationController");

ReservationRouter.post(
  "/Available", //verifToken.isClient,
  getAvailableTimeOnAdate
);
ReservationRouter.get(
  "/space/:spaceId", //verifToken.isClient,
  getSpaceReservations
);

ReservationRouter.put(
  "/space/toggle/:reservationId", //verifToken.isClient,
  toggleReservationStatus
);

ReservationRouter.post("/add/:_id", verifToken.isClient, Create);
ReservationRouter.get(
  "/getAllByUser",
  verifToken.isClient,
  getClientReservations
);
module.exports = ReservationRouter;
