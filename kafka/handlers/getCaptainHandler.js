import findCaptain from "../../controllers/findCaptain.js";
import producer from "../producer.js";

async function getCaptainHandler({message}) {
        const location = JSON.parse(message.value).pickUpLocation;

        if (location) {
            const captains = await findCaptain(location);
            await producer.sendProducerMessage("captains-fetched", captains);
    }
}

export default getCaptainHandler;