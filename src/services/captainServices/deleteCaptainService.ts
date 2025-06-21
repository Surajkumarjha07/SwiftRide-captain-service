import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import { deleteType } from "../../types/captainTypes.js";

const deleteCaptain = async ({ captainEmail, password }: deleteType) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email: captainEmail } })

        if (!captain) {
            throw new Error("Captain doesn't exist!");
        }

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!passwordMatched) {
            throw new Error("Incorrect Password!");
        }

        const deletedCaptain = await prisma.captains.delete({ where: { email: captainEmail } });

        return deletedCaptain;

    } catch (error) {
        if (error instanceof Error) {
            console.log("delete service error: ", error.message);
            throw error;
        }
    }
}

export default deleteCaptain;