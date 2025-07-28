import { Request, Response } from "express";
import { rideService } from "../../services/rides.services/index.service.js";
import CaptainPayload from "../../types/actionPayload.type.js";

async function handleRideCompleted(req: Request, res: Response) {
    try {
        const { rideId } = req.body;
        const { captainId } = req.captain as CaptainPayload;

        if (!captainId) {
            res.status(400).json({
                message: "Id not available"
            });
            return;
        }

        await rideService.rideComplete(captainId, rideId);

        res.status(200).json({
            message: "ride completed!"
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            });
        }
    }
}

export default handleRideCompleted;