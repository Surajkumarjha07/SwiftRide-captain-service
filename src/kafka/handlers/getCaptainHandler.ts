import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";
import findCaptains from "../../utils/findCaptains.js";

async function getCaptainHandler({ message }: EachMessagePayload) {
    const rideData = JSON.parse(message.value!.toString());
    const { pickUpLocation_latitude, pickUpLocation_longitude } = rideData;
    let captains: any[] = [];

    if (pickUpLocation_latitude && pickUpLocation_longitude) {
        console.log("Finding captains near:", pickUpLocation_latitude, pickUpLocation_longitude);
        captains = await findCaptains({ pickUpLocation_latitude, pickUpLocation_longitude }, 5);
    }

    console.log("captains found: ", captains);

    if (captains.length === 0) {
        await sendProducerMessage("no-captain-found-notify-ride", { rideData });
        await sendProducerMessage("no-captain-found-notify-gateway", { rideData });
        await sendProducerMessage("no-captain-found-notify-user", { rideData });
        return;
    }

    await sendProducerMessage("captains-fetched", { captains, rideData });
}

export default getCaptainHandler;