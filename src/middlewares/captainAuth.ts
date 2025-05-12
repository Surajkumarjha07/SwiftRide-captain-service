import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import CaptainPayload from "../types/captainPayload.js";

dotenv.config();

async function captainAuthenticate(req: Request, res: Response, next: NextFunction) {
    let token = req.cookies.authtoken || req.headers["authorization"]?.split("Bearer ")[1];
    if (!token) {
        res.status(404).json({ message: "token not available" });
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        if (verified) {
            req.captain = verified as CaptainPayload;
            next();
        }
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export default captainAuthenticate;