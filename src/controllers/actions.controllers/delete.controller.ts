import { Request, Response } from "express";
import { captainService } from "../../services/actions.services/index.service.js";
import CaptainPayload from "../../types/actionPayload.type.js";

async function handleDeleteCaptain(req: Request, res: Response) {
    try {
        const { password } = req.body;
        const { captainEmail } = req.captain as CaptainPayload;

        if (!captainEmail || !password) {
            res.status(400).json({
                message: "Enter all credentials!"
            });
            return;
        }

        const deletedCaptain = await captainService.deleteCaptain({ captainEmail, password })

        res.status(200).json({
            message: "Captain deleted!",
            deletedCaptain
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message || "Internal server error!"
            })
        }
    }
}

export default handleDeleteCaptain;