import { Router } from "express";
import captainAuthenticate from "../middlewares/captainAuth.middleware.js";
import handleRideAccepted from "../controllers/rides.controllers/rideAccepted.controller.js";
import handleRideCompleted from "../controllers/rides.controllers/rideCompleted.controller.js";

const router = Router();

router.route("/acceptRide").post(captainAuthenticate, handleRideAccepted);
router.route("/rideCompleted").post(captainAuthenticate, handleRideCompleted);

export default router;