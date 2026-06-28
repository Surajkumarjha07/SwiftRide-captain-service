import { availability, vehicleVerified } from "@prisma/client";
import prisma from "../config/database.js";
import { locationType } from "../types/location.type.js";
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
            ST_DistanceSphere(
                    ST_MakePoint(${userLongitude}::double precision, ${userLatitude}::double precision),
                    ST_MakePoint(longitude, latitude)
            ) AS Distance
            FROM captains
            WHERE
                latitude BETWEEN ${sw.latitude}::double precision AND ${ne.latitude}::double precision
                AND
                longitude BETWEEN ${sw.longitude}::double precision AND ${ne.longitude}::double precision
                AND
                vehicle_type=${vehicle}::"vehicles"
                AND
                is_available=${availability.AVAILABLE}::"availability"
                AND
                vehicle_verified=${vehicleVerified.VERIFIED}::"vehicleVerified"
                AND
                ST_DistanceSphere(
                    ST_MakePoint(${userLongitude}::double precision, ${userLatitude}::double precision),
                    ST_MakePoint(longitude, latitude)
                ) <= ${radiusInMeter}
                ORDER BY Distance ASC
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