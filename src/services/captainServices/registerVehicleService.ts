import { vehicles, vehicleVerified } from "@prisma/client";
import prisma from "../../config/database.js";

async function registerVehicleService(captainEmail: string, vehicle: string, vehicleNo: string): Promise<any> {
    try {
        const existingVehicle = await prisma.captains.findFirst({
            where: {
                vehicle_number: vehicleNo
            }
        })

        if (existingVehicle) {
            throw new Error("Vehicle already registered!");
        }

        const vehicle_registered = await prisma.captains.update({
            where: {
                email: captainEmail
            },
            data: {
                vehicle_type: vehicle === "SUV" ? vehicles.SUV : (vehicle === "bike" ? vehicles.bike : vehicles.car),
                vehicle_number: vehicleNo,
                vehicle_verified: vehicleVerified.VERIFIED
            }
        })

        return vehicle_registered;

    } catch (error) {
        throw new Error("Error in verify-vehicle service: " + (error as Error).message);
    }
}

export default registerVehicleService;