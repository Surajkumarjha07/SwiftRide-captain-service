import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";
import { rideService } from "../../services/rideServices/index.js";

async function getCaptainHandler({ message }: EachMessagePayload) {
    const location = JSON.parse(message.value!.toString()).pickUpLocation;
    const rideData = JSON.parse(message.value!.toString());

    if (location) {
        const captains = await rideService.findCaptainHandler(location);
        await sendProducerMessage("captains-fetched", { captains, rideData });
    }
}

export default getCaptainHandler;