import prisma from "../../config/database.js";
import bcrypt from "bcryptjs";
import { updateType } from "../../types/captainTypes.js";
import { vehicles } from "@prisma/client";

const updateCaptain = async ({ newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword, captainEmail }: updateType) => {
    try {
        const captain = await prisma.captains.findFirst({
            where: { email: captainEmail }
        });

        let passwordMatched;
        if (captain && oldPassword) {
            passwordMatched = await bcrypt.compare(oldPassword, captain.password);
        }

        if (!passwordMatched || !captain) {
            throw new Error("Incorrect Email or Password!");
        }

        let updateData: { email?: string, name?: string, password?: string, vehicle_type?: vehicles, vehicle_number?: string } = {};

        if (newPassword) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        if (newEmail) {
            updateData.email = newEmail
        }

        if (newName) {
            updateData.name = newName
        }

        if (newVehicleType) {
            updateData.vehicle_type = newVehicleType as vehicles
        }

        if (newVehicleNo) {
            updateData.vehicle_number = newVehicleNo
        }

        const updatedCaptain = await prisma.captains.update({
            where: { email: captainEmail },
            data: updateData
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
