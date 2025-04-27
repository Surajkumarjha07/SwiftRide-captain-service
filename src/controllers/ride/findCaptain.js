import { PrismaClient, availability } from "@prisma/client";

const prisma = new PrismaClient();

async function findCaptain(location, res) {
    try {
        if (!location) {
            return res.status(400).json({
                message: "unknown location"
            })
        }

        const captains = await prisma.captains.findMany({ where: { location: location, isAvailable: availability.AVAILABLE } });
        return captains;
    } catch (error) {
        console.log("error in finding captains...");
    }
}

export default findCaptain;