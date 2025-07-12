import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideCancelledHandler({ message }: EachMessagePayload) {
    try {
        const { rideData } = JSON.parse(message.value!.toString());

        await sendProducerMessage("ride-cancelled-notify-user", { rideData });

    } catch (error) {
        throw new Error("Error in getting ride-cancelled handler(captain): " + (error as Error).message);
    }
}

export default rideCancelledHandler;