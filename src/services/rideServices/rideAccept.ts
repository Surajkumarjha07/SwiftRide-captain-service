import { availability } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";
import redisClient from "../../redis/redisClient.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideAccept(id: string) {
    try {
        await prisma.captains.updateMany({
            where: { captainId: id, isAvailable: availability.AVAILABLE },
            data: {
                isAvailable: availability.UNAVAILABLE
            }
        })

        const rideData = await redisClient.hgetall(`ride:${id}`);
        await sendProducerMessage("ride-accepted", { id, rideData });

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride accept service error: ", error.message);
            throw error;
        }
    }
}

export default rideAccept;