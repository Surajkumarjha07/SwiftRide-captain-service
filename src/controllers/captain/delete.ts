import { Request, Response } from "express";
import { captainService } from "../../services/captainServices/index.js";
import CaptainPayload from "../../types/captainPayload.js";

async function handleDeleteCaptain(req: Request, res: Response) {
    try {
        const { password } = req.body;
        const { captainEmail } = req.captain as CaptainPayload;

        const deletedCaptain = await captainService.deleteCaptain({ captainEmail, password })

        res.status(200).json({
            message: "Captain deleted!",
            deletedCaptain
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            })
        }
    }
}

export default handleDeleteCaptain;