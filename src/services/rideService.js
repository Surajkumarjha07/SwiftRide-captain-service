import { availability } from "@prisma/client";
import sendProducerMessage from "../kafka/producers/producerTemplate.js"
import prisma from "../prisma/prismaClient.js";
import redisClient from "../redis/redisClient.js";

async function rideAccept(id) {
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
        console.log("Ride accept service error: ", error.message);
        throw error;
    }
}

async function findCaptain(location) {
    try {
        const captains = await prisma.captains.findMany({ where: { location: location, isAvailable: availability.AVAILABLE } });
        return captains;
    } catch (error) {
        console.log("Find captain service error: ", error.message);
        throw error;
    }
}

async function rideComplete(id) {
    try {
        await prisma.captains.updateMany({
            where: { captainId: id, isAvailable: availability.UNAVAILABLE },
            data: {
                isAvailable: availability.AVAILABLE
            }
        })

        const rideData = await redisClient.hgetall(`ride:${id}`);

        if (id && rideData) {
            await sendProducerMessage("ride-completed", { id, rideData });
        }
    } catch (error) {
        console.log("Ride Complete service error: ", error.message);
        throw error;
    }
}

export const rideService = { rideAccept, findCaptain, rideComplete };