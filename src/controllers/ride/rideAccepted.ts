import { Request, Response } from "express";
import { rideService } from "../../services/rideServices/index.js";
import CaptainPayload from "../../types/captainPayload.js";

async function handleRideAccepted(req: Request, res: Response) {
    try {
        const { rideId } = req.body;
        const { captainId } = req.captain as CaptainPayload;

        if (!captainId) {
            res.status(400).json({
                message: "Captain not authorized"
            });
            return;
        }

        await rideService.rideAccept(captainId, rideId);

        res.status(200).json({
            message: `Ride accepted by: ${captainId}`
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            });
        }
    }
}

export default handleRideAccepted;