import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

async function handleCaptainLogIn(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const captain = await prisma.captains.findFirst({ where: { email } })        

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }        

        if (!captain || !passwordMatched) {
            res.status(404).json({
                message: "Incorrect email or password!"
            });
            return;
        }

        const token = jwt.sign({ email, name: captain.name }, process.env.JWT_SECRET, { expiresIn: "1min" })
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "User Logged In!",
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleCaptainLogIn;