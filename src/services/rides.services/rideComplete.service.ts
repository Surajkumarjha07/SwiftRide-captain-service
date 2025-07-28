import { availability } from "@prisma/client";
import prisma from "../../config/database.js";
import redis from "../../config/redis.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideComplete(captainId: string, rideId: string) {
    try {
        await prisma.captains.updateMany({
            where: { captainId: captainId, is_available: availability.UNAVAILABLE },
            data: {
                is_available: availability.AVAILABLE
            }
        });

        const rideData = await redis.hgetall(`ride:${rideId}`);

        if (captainId && rideData) {
            // await sendProducerMessage("payment-requested", { captainId, rideData });
            await sendProducerMessage("payment-requested-notify-user", { rideData, captainId });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride Complete service error: ", error.message);
            throw error;
        }
    }
}

export default rideComplete;
