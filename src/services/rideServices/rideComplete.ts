import { availability } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";
import redisClient from "../../redis/redisClient.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideComplete(captainId: string, rideId: string) {
    try {
        await prisma.captains.updateMany({
            where: { captainId: captainId, isAvailable: availability.UNAVAILABLE },
            data: {
                isAvailable: availability.AVAILABLE
            }
        });

        const rideData = await redisClient.hgetall(`ride:${rideId}`);

        if (captainId && rideData) {
            await sendProducerMessage("ride-completed", { captainId, rideData });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride Complete service error: ", error.message);
            throw error;
        }
    }
}

export default rideComplete;
