import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";
import prisma from "../../config/database.js";
import { availability } from "@prisma/client";

async function rideCancelledHandler({ message }: EachMessagePayload) {
    try {
        const { rideData } = JSON.parse(message.value!.toString());
        const { captainId } = rideData;

        await prisma.captains.update({
            where: {
                captainId: captainId
            },
            data: {
                is_available: availability.AVAILABLE
            }
        })

        await sendProducerMessage("ride-cancelled-notify-captain", { rideData });

    } catch (error) {
        throw new Error("Error in getting ride-cancelled handler(captain): " + (error as Error).message);
    }
}

export default rideCancelledHandler;