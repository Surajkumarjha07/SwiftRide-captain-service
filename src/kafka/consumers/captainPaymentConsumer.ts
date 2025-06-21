import { captain_payment_consumer } from "../consumerInIt.js";
import captainPaymentHandler from "../handlers/captainPaymentHandler.js";

async function captainPayment() {
    try {
        await captain_payment_consumer.subscribe({ topic: "captain-payment", fromBeginning: true });
        await captain_payment_consumer.run({
            eachMessage: captainPaymentHandler
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in captain-payment consumer: ${error.message}`);
        }
    }
}

export default captainPayment;