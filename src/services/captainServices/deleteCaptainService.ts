import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import { loginType } from "../../types/captainTypes.js";

const deleteCaptain = async ({ email, password }: loginType) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            throw new Error("Incorrect Email or Password!");
        }

        const deletedCaptain = await prisma.captains.delete({ where: { email } });

        return deletedCaptain;

    } catch (error) {
        if (error instanceof Error) {
            console.log("delete service error: ", error.message);
            throw error;
        }
    }
}

export default deleteCaptain;