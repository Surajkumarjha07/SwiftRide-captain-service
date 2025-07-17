import { EachMessagePayload } from "kafkajs";
import captainCoordsMap from "../../captainMap.js";
import redis from "../../config/redis.js";
import { coords } from "../../types/locationTypes.js";

async function captainLocationUpdateHandler({ message }: EachMessagePayload) {
    try {
        const { coordinates, captainId }: { coordinates: coords, captainId: string } = JSON.parse(message.value!.toString());

        const captain_redis_coord = await redis.hgetall(`captain-location-updates:${captainId}`);

        const latitudeChanged: boolean = coordinates.latitude !== Number(captain_redis_coord.latitude);
        const longitudeChanged: boolean = coordinates.longitude !== Number(captain_redis_coord.longitude);

        if (!latitudeChanged && !longitudeChanged) return;

        await redis.hset(`captain-location-updates:${captainId}`, { latitude: String(coordinates.latitude), longitude: String(coordinates.longitude) });
        captainCoordsMap.set(captainId, coordinates);

    } catch (error) {
        throw new Error("Error in Captain-Location-Update handler: " + (error as Error).message);
    }
}

export default captainLocationUpdateHandler;