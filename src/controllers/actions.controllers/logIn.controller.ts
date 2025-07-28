import { Request, Response } from "express";
import { captainService } from "../../services/actions.services/index.service.js";

async function handleCaptainLogIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const token = await captainService.logInCaptain({ email, password })

        if (token) {
            res.cookie("authToken", token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 60 * 60 * 1000,
                path: "/"
            });
        }

        res.status(200).json({
            message: "User Logged In!",
            token
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            });
        }
    }
}

export default handleCaptainLogIn;