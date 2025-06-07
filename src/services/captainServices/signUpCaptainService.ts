import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import { signUpType } from "../../types/captainTypes.js";

const signUpCaptain = async ({ email, name, password, role, latitude, longitude }: signUpType) => {
    try {
        const existingCaptain = await prisma.captains.findFirst({ where: { email } })

        if (existingCaptain) {
            throw new Error("Email already exists!");
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

        return await prisma.captains.create({ data: { email: email.trim(), name: name.trim(), password: hashedPassword.trim(), role: role.trim(), latitude: latitude, longitude: longitude, captainId: captainId.trim() } });

    } catch (error) {
        if (error instanceof Error) {
            console.log("SignUp service error: ", error.message);
            throw error;
        }
    }
}

export default signUpCaptain;