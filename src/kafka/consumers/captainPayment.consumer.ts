import { update_captain_earnings_consumer } from "../consumerInIt.js";
import captainPaymentHandler from "../handlers/captainPayment.handler.js";

async function captainPayment() {
    try {
        await update_captain_earnings_consumer.subscribe({ topic: "update-captain-earnings", fromBeginning: true });
        await update_captain_earnings_consumer.run({
            eachMessage: captainPaymentHandler
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in update-captain-earnings consumer: ${error.message}`);
        }
    }
}

export default captainPayment;