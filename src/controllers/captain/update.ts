import { Request, Response } from "express";
import { captainService } from "../../services/captainServices/index.js";
import CaptainPayload from "../../types/captainPayload.js";

async function handleUpdateCaptainInfo(req: Request, res: Response) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.captain as CaptainPayload;

        const updatedCaptain = await captainService.updateCaptain({ newEmail, newName, newRole, newPassword, oldPassword, email })

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