import { captain_location_update } from "../consumerInIt.js";
import captainLocationUpdateHandler from "../handlers/captainLocationUpdateHandler.js";

async function captainLocationUpdate() {
    try {
        await captain_location_update.subscribe({topic: "captain-location-update", fromBeginning: true});

        await captain_location_update.run({
            eachMessage: captainLocationUpdateHandler
        })
        
    } catch (error) {
        throw new Error("Error in Captain-Location-Update consumer: " + (error as Error).message);
    }
}

export default captainLocationUpdate;