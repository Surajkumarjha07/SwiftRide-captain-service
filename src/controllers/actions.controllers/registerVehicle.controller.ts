import { Request, Response } from "express";
import CaptainPayload from "../../types/actionPayload.type.js";
import registerVehicleService from "../../services/actions.services/registerVehicle.service.js";

async function registerVehicle(req: Request, res: Response): Promise<any> {
    try {
        const { vehicle, vehicleNo } = req.body;
        const { captainEmail } = req.captain as CaptainPayload;

        const vehicle_registered = await registerVehicleService(captainEmail, vehicle, vehicleNo);

        if (vehicle_registered) {
            return res.status(200).json({
                message: "Vehicle registered!",
                vehicle_registered
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: (error as Error).message || "Internal server error!"
        })
    }
}

export default registerVehicle;