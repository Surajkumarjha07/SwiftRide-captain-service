import { availability } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";

async function findCaptains(location: string) {
    try {
        const captains = await prisma.captains.findMany({ where: { location: location, isAvailable: availability.AVAILABLE } });
        return captains;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Find captain service error: ", error.message);
            throw error;
        }
    }
}

export default findCaptains;