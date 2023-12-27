const express = require("express");
const router = express.Router();
const Partnership = require("../controllers/Partnership.controller");
const verifToken = require("../middelwares/VerifToken");

router.put("/approve/:id", Partnership.Approve);
router.post("/create", Partnership.CreatePartnerShip);

module.exports = router;
