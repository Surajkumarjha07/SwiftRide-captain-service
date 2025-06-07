import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { loginType } from "../../types/captainTypes.js";

dotenv.config();

const logInCaptain = async ({ email, password }: loginType) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            throw new Error("Incorrect email or password!");
        }

        const token = jwt.sign({ captainEmail: email, captainId: captain.captainId, captainName: captain.name }, process.env.JWT_SECRET!, { expiresIn: "1h" })
        return token;

    } catch (error) {
        if (error instanceof Error) {
            console.log("LogIn service error: ", error.message);
            throw error;
        }
    }
}

export default logInCaptain;