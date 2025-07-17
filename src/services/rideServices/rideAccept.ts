import { availability } from "@prisma/client";
import prisma from "../../config/database.js";
import redis from "../../config/redis.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideAccept(captainId: string, rideId: string, vehicle: string, vehicle_number: string) {
    try {
        await prisma.captains.updateMany({
            where: { captainId: captainId, is_available: availability.AVAILABLE },
            data: {
                is_available: availability.UNAVAILABLE
            }
        })

        const rideData = await redis.hgetall(`ride:${rideId}`);
        rideData.captainId = captainId;
        rideData.vehicle = vehicle;
        rideData.vehicle_number = vehicle_number;
        await redis.hset(`rideData:${rideData.userId}`, rideData);
        await redis.hset(`ride:${rideId}`, rideData);

        await sendProducerMessage("ride-accepted", { captainId, rideData });

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride accept service error: ", error.message);
            throw error;
        }
    }
}

export default rideAccept;