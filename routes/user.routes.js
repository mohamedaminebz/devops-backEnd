const express = require("express");
const router = express.Router();
const authController = require("../auth/Authentification.controller");
const verifToken = require("../middelwares/VerifToken");
const { statistic, getRecentReservations, weeklySums } = require("../controllers/AdminController");

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.get("/getUserByToken", verifToken.isUser, authController.GetUserByToken);
router.get("/refreshToken", authController.RefreshToken);
router.put("/updateInfo", verifToken.isUser, authController.UpdateGeneralInfos);
router.put(
  "/change_password",
  verifToken.isUser,
  authController.ChangePassword
);
router.get("/stats",statistic)
router.get("/recentReservations",getRecentReservations)
router.get("/weekly-sums",weeklySums)

module.exports = router;
