import { Request, Response } from "express";
import { captainService } from "../../services/captainServices/index.js";

async function handleRegisterCaptain(req: Request, res: Response) {
    try {
        const { email, name, password, role, location } = req.body;

        if (!email || !name || !password || !role || !location) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const captain = await captainService.signUpCaptain({ email, name, password, role, location });

        res.status(200).json({
            message: "Captain created!",
            captain
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

export default handleRegisterCaptain;