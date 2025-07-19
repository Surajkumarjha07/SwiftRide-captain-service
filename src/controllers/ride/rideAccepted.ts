import { Request, Response } from "express";
import { rideService } from "../../services/rideServices/index.js";
import CaptainPayload from "../../types/captainPayload.js";
import redis from "../../config/redis.js";

async function handleRideAccepted(req: Request, res: Response) {
    try {
        const { rideId, vehicle, vehicle_number } = req.body;
        const { captainId } = req.captain as CaptainPayload;

        if (!rideId) {
            res.status(400).json({
                message: "rideId not provided"
            });
            return;
        }

        if (!captainId) {
            res.status(400).json({
                message: "Captain not authorized"
            });
            return;
        }

        const rideData = await redis.hgetall(`ride:${rideId}`);

        console.log("rd: ", rideData);
        

        if (Object.keys(rideData).length === 0) {
            res.status(410).json({
                message: "ride expired!"
            });
            return;
        }

        await rideService.rideAccept(captainId, rideId, vehicle, vehicle_number);

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