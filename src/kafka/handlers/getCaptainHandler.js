import findCaptain from "../../controllers/ride/findCaptain.js"
import sendProducerMessage from "../producers/producerTemplate.js";

async function getCaptainHandler({ message }) {
    const location = JSON.parse(message.value).pickUpLocation;
    const rideData = JSON.parse(message.value);

    if (location) {
        const captains = await findCaptain(location);
        await sendProducerMessage("captains-fetched", { captains, rideData });
    }
}

export default getCaptainHandler;