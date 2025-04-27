import express from "express";
import handleUpdateCaptainInfo from "../controllers/user/update.js";
import handleCaptainLogIn from "../controllers/user/logIn.js";
import handleRegisterCaptain from "../controllers/user/signUp.js";
import handleDeleteCaptain from "../controllers/user/delete.js";
import captainAuthenticate from "../middlewares/captainAuth.js";

const router = express.Router();

router.post("/registerCaptain", handleRegisterCaptain);
router.post("/loginCaptain", handleCaptainLogIn);
router.put("/updateCaptain", captainAuthenticate, handleUpdateCaptainInfo);
router.delete("/deleteCaptain", captainAuthenticate, handleDeleteCaptain);

export default router;