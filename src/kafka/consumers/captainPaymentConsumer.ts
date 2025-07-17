import { update_captain_earnings } from "../consumerInIt.js";
import captainPaymentHandler from "../handlers/captainPaymentHandler.js";

async function captainPayment() {
    try {
        await update_captain_earnings.subscribe({ topic: "update-captain-earnings", fromBeginning: true });
        await update_captain_earnings.run({
            eachMessage: captainPaymentHandler
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in update-captain-earnings consumer: ${error.message}`);
        }
    }
}

export default captainPayment;