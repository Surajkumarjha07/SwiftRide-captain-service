import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function handleRegisterCaptain(req, res) {
    try {
        const { email, name, password, role, location } = req.body;
        if (!email || !name || !password || !role || !location) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const existingCaptain = await prisma.captains.findFirst({ where: { email } })

        if (existingCaptain) {
            return res.status(409).json({
                message: "Email already exists!"
            })
        }

        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let captainId = '';

        for (let i = 0; i < 15; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            captainId = captainId + alpha[pos];
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt)

        const captain = await prisma.captains.create({ data: { email, name, password: hashedPassword, role, location, captainId } });

        res.status(200).json({
            message: "Captain created!",
            captain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleRegisterCaptain;