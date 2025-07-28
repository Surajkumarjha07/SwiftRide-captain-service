import { Request, Response } from "express";
import { captainService } from "../../services/actions.services/index.service.js";
import CaptainPayload from "../../types/actionPayload.type.js";

async function handleUpdateCaptainInfo(req: Request, res: Response) {
    try {
        const { newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword } = req.body;
        const { captainEmail } = req.captain as CaptainPayload;

        const updatedCaptain = await captainService.updateCaptain({ newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword, captainEmail })

        res.status(200).json({
            message: "Captain updated!",
            updatedCaptain
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            });
            return;
        }
    }
}

export default handleUpdateCaptainInfo;