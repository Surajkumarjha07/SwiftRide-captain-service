import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function handleDeleteCaptain(req, res) {
    try {
        const { password } = req.body;
        const { email } = req.captain;

        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password!"
            });
        }

        const deletedCaptain = await prisma.captains.delete({ where: { email } });

        res.status(200).json({
            message: "Captain deleted!",
            deletedCaptain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleDeleteCaptain;