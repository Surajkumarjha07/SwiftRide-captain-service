import { Request, Response } from "express";
import { captainService } from "../../services/actions.services/index.service.js";

async function handleRegisterCaptain(req: Request, res: Response) {
    try {
        const { email, name, password, role, latitude, longitude } = req.body;

        if (!email || !name || !password || !role) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const captain = await captainService.signUpCaptain({ email, name, password, role, latitude, longitude });

        res.status(201).json({
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