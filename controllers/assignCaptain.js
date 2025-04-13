import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findCaptain(location, res) {
    try {
        if (!location) {
            return res.status(400).json({
                message: "unknown location"
            })
        }

        const captains = await prisma.captains.findMany({ where: { location: location } });
        return captains;
    } catch (error) {
        console.log("error in finding captains...");
    }
}

async function rideAccepted(req, res) {
    try {
        
    } catch (error) {
        console.log("error in accepting ride!");        
    }
}

export default { findCaptain, rideAccepted };