import express from "express";
import handleUpdateCaptainInfo from "../controllers/captain/update.js";
import handleCaptainLogIn from "../controllers/captain/logIn.js";
import handleRegisterCaptain from "../controllers/captain/signUp.js";
import handleDeleteCaptain from "../controllers/captain/delete.js";
import captainAuthenticate from "../middlewares/captainAuth.js";
import registerVehicle from "../controllers/captain/registerVehicle.js";
import handleLogOut from "../controllers/captain/logout.js";

const router = express.Router();

router.post("/registerCaptain", handleRegisterCaptain);
router.post("/loginCaptain", handleCaptainLogIn);
router.put("/updateCaptain", captainAuthenticate, handleUpdateCaptainInfo);
router.delete("/deleteCaptain", captainAuthenticate, handleDeleteCaptain);
router.post("/verify-vehicle", captainAuthenticate, registerVehicle);
router.post("/logout", handleLogOut);

export default router;