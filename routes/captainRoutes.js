import express from "express";
import handleUpdateCaptainInfo from "../controllers/update.js";
import handleCaptainLogIn from "../controllers/logIn.js";
import handleRegisterCaptain from "../controllers/signUp.js";
import handleDeleteCaptain from "../controllers/delete.js";
import captainAuthenticate from "../middlewares/captainAuth.js";

const router = express.Router();

router.post("/registerCaptain", handleRegisterCaptain);
router.post("/loginCaptain", handleCaptainLogIn);
router.put("/updateCaptain", captainAuthenticate, handleUpdateCaptainInfo);
router.delete("/deleteCaptain", captainAuthenticate, handleDeleteCaptain);

export default router;