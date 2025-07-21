import { availability, vehicleVerified } from "@prisma/client";
import prisma from "../config/database.js";
import { locationType } from "../types/locationTypes.js";
import { getBoundsOfDistance } from "geolib";

async function findCaptains(locationCoordinates: locationType, vehicle: string, radius: number): Promise<any> {
    try {
        const { pickUpLocation_latitude: userLatitude, pickUpLocation_longitude: userLongitude } = locationCoordinates
        const radiusInMeter = radius * 1000;

        const bounds = getBoundsOfDistance(
            { latitude: userLatitude, longitude: userLongitude },
            radiusInMeter
        )

        const [sw, ne] = bounds;

        const captains = await prisma.$queryRaw`
            SELECT *,
            ST_Distance(
                    ST_MakePoint(longitude, latitude)::geography,
                    ST_MakePoint(${userLongitude}, ${userLatitude})::geography,
                ) AS distance
            FROM captains
            WHERE
                latitude BETWEEN ${sw.latitude} AND ${ne.latitude}
                AND
                longitude BETWEEN ${sw.longitude} AND ${ne.longitude}
                AND
                vehicle_type=${vehicle}
                AND
                is_available=${availability.AVAILABLE}
                AND
                vehicle_verified=${vehicleVerified.VERIFIED}
                AND
                ST_DWithin(
                    ST_MakePoint(longitude, latitude)::geography,
                    ST_MakePoint(${userLongitude}, ${userLatitude})::geography,
                    ${radiusInMeter}
                )
                ORDER BY distance ASC
                LIMIT 10
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