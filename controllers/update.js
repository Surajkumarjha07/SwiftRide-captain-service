import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function handleUpdateCaptainInfo(req, res) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.captain;

        const captain = await prisma.captains.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(oldPassword, captain.password);
        }

        if (!passwordMatched || !captain) {
            return res.status(400).json({
                message: "Incorrect Email or Password!"
            })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedCaptain = await prisma.captains.update({
            where: { email },
            data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
        })

        res.status(200).json({
            message: "Captain updated!",
            updatedCaptain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleUpdateCaptainInfo;