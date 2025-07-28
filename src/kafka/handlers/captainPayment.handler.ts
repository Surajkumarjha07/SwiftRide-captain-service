import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";

async function captainPaymentHandler({ message }: EachMessagePayload) {
    try {
        const { fare, payment_id, orderId, order, userId, rideId, captainId } = JSON.parse(message.value!.toString());
        const { captain_commission } = order;

        await prisma.captains.update({
            where: {
                captainId: captainId
            },

            data: {
                total_earnings: {
                    increment: captain_commission
                }
            }
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in update-captain-payment handler: ${error.message}`);
        }
    }
}

export default captainPaymentHandler;