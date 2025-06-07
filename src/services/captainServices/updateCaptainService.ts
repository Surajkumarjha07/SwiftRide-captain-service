import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import { updateType } from "../../types/captainTypes.js";

const updateCaptain = async ({ newEmail, newName, newPassword, newRole, oldPassword, email }: updateType) => {
    try {
        const captain = await prisma.captains.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(oldPassword, captain.password);
        }

        if (!passwordMatched || !captain) {
            throw new Error("Incorrect Email or Password!");
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedCaptain = await prisma.captains.update({
            where: { email },
            data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
        })

        return updatedCaptain;

    } catch (error) {
        if (error instanceof Error) {
            console.log("Update service error: ", error.message);
            throw error;
        }
    }
}

export default updateCaptain;
