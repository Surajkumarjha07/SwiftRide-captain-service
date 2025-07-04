import { EachMessagePayload } from "kafkajs";
import redis from "../../config/redis.js";

async function acceptRideHandler({ message }: EachMessagePayload) {
    try {
        const { captain, rideData } = JSON.parse(message.value!.toString());
        const { rideId } = rideData;

        // cached data for future use in ride accepting
        await redis.hmset(`ride:${rideId}`, rideData);
        await redis.expire(`ride:${rideId}`, 24 * 3600);

        // later we will emit sockets for mobile interactivity
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in acceptRideHandler: " + error.message);
        }
    }
}

export default acceptRideHandler;