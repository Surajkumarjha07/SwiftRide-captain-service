import { Router } from "express";
import captainAuthenticate from "../middlewares/captainAuth.js";
import handleRideAccepted from "../controllers/ride/rideAccepted.js";
import handleRideCompleted from "../controllers/ride/rideCompleted.js";

const router = Router();

router.route("/acceptRide").post(captainAuthenticate, handleRideAccepted);
router.route("/rideCompleted").post(captainAuthenticate, handleRideCompleted);

export default router;