import express from "express";
import handleUpdateCaptainInfo from "../controllers/actions.controllers/update.controller.js";
import handleCaptainLogIn from "../controllers/actions.controllers/logIn.controller.js";
import handleRegisterCaptain from "../controllers/actions.controllers/signUp.controller.js";
import handleDeleteCaptain from "../controllers/actions.controllers/delete.controller.js";
import captainAuthenticate from "../middlewares/captainAuth.middleware.js";
import registerVehicle from "../controllers/actions.controllers/registerVehicle.controller.js";
import handleLogOut from "../controllers/actions.controllers/logout.controller.js";

const router = express.Router();

router.post("/registerCaptain", handleRegisterCaptain);
router.post("/loginCaptain", handleCaptainLogIn);
router.put("/updateCaptain", captainAuthenticate, handleUpdateCaptainInfo);
router.delete("/deleteCaptain", captainAuthenticate, handleDeleteCaptain);
router.post("/verify-vehicle", captainAuthenticate, registerVehicle);
router.post("/logout", handleLogOut);

export default router;