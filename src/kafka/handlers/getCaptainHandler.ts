import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";
import findCaptains from "../../utils/findCaptains.js";

async function getCaptainHandler({ message }: EachMessagePayload) {
    const rideData = JSON.parse(message.value!.toString());
    const { pickUpLocation_latitude, pickUpLocation_longitude } = rideData;

    if (pickUpLocation_latitude && pickUpLocation_longitude) {
        const captains = await findCaptains({ pickUpLocation_latitude, pickUpLocation_longitude }, 5);

        if (!captains) {
            await sendProducerMessage("no-captain-found", { rideData });
        }

        await sendProducerMessage("captains-fetched", { captains, rideData });
    }
}

export default getCaptainHandler;