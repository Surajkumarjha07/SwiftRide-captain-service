import { availability } from "@prisma/client";
import sendProducerMessage from "../kafka/producers/producerTemplate.js"
import prisma from "../prisma/prismaClient.js";
import redisClient from "../redis/redisClient.js";

async function rideAccept(id) {
    try {
        await sendProducerMessage("ride-accepted", id);
        await prisma.captains.update({
            where: { captainId: id },
            data: {
                isAvailable: availability.UNAVAILABLE
            }
        })

        // const rideData = await redisClient.hmget(`ride:${}`)

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
        await prisma.captains.update({
            where: { captainId: id },
            data: {
                isAvailable: availability.AVAILABLE
            }
        })

        await sendProducerMessage("ride-completed", id);
    } catch (error) {
        console.log("Ride Complete service error: ", error.message);
        throw error;
    }
}

export const rideService = { rideAccept, findCaptain, rideComplete };