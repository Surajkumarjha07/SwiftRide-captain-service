import { Request, Response } from "express";
import { rideService } from "../../services/rideServices/index.js";
import CaptainPayload from "../../types/captainPayload.js";

async function handleRideCompleted(req: Request, res: Response) {
    try {
        const { id } = req.captain as CaptainPayload;

        if (!id) {
            res.status(400).json({
                message: "Id not available"
            });
            return;
        }

        await rideService.rideComplete(id);

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