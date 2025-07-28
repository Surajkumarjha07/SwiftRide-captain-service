import { captain_location_update_consumer } from "../consumerInIt.js";
import captainLocationUpdateHandler from "../handlers/locationUpdate.handler.js";

async function captainLocationUpdate() {
    try {
        await captain_location_update_consumer.subscribe({ topic: "captain-location-update", fromBeginning: true });

        await captain_location_update_consumer.run({
            eachMessage: captainLocationUpdateHandler
        })

    } catch (error) {
        throw new Error("Error in Captain-Location-Update consumer: " + (error as Error).message);
    }
}

export default captainLocationUpdate;