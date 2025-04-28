import { rideService } from "../../services/rideService.js";

async function findCaptain(location, res) {
    try {
        if (!location) {
            return res.status(400).json({
                message: "unknown location"
            })
        }

        const captains = await rideService.findCaptain(location);

        return captains;
    } catch (error) {
        console.log("error in finding captains...");
        throw error;
    }
}

export default findCaptain;