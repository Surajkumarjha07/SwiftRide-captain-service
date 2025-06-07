import { availability } from "@prisma/client";
import prisma from "../config/database.js";
import { locationType } from "../types/locationTypes.js";
import { getBoundsOfDistance } from "geolib";

async function findCaptains(locationCoordinates: locationType, radius: number): Promise<any> {
    try {
        const { pickUpLocation_latitude: userLatitude, pickUpLocation_longitude: userLongitude } = locationCoordinates
        const radiusInMeter = radius * 1000;

        const bounds = getBoundsOfDistance(
            { latitude: userLatitude, longitude: userLongitude },
            radiusInMeter
        )

        const [sw, ne] = bounds;

        const captains = await prisma.$queryRaw`
            SELECT * FROM captains
            WHERE
                latitude BETWEEN ${sw.latitude} AND ${ne.latitude}
                AND
                longitude BETWEEN ${sw.longitude} AND ${ne.longitude}
                AND
                isAvailable=${availability.AVAILABLE}
                AND
                ST_distance_sphere(
                    point(${userLatitude}, ${userLongitude}),
                    point(latitude, longitude)
                ) <= ${radiusInMeter}
            `

        return captains;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Find captain service error: ", error.message);
            throw error;
        }
    }
}

export default findCaptains;