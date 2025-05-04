import redisClient from "../../redis/redisClient.js";
import sendProducerMessage from "../producers/producerTemplate.js";

async function acceptRideHandler({ message }) {
    const { rideData } = JSON.parse(message.value.toString());
    const { rideId } = rideData;

    await redisClient.hmset(`ride:${rideId}`, rideData);
    await redisClient.expire(`ride:${rideId}`, 3600);
    await sendProducerMessage("ride-saved", rideId);

    // later we will emit sockets
}

export default acceptRideHandler;