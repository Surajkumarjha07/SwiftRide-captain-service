import { EachMessagePayload } from "kafkajs";
import redisClient from "../../redis/redisClient.js";

async function acceptRideHandler({ message }: EachMessagePayload) {
    const { rideData, captain } = JSON.parse(message.value!.toString());
    const { captainId } = captain;

    await redisClient.hmset(`ride:${captainId}`, rideData);
    await redisClient.expire(`ride:${captainId}`, 24*3600);

    // later we will emit sockets for mobile interactivity
}

export default acceptRideHandler;