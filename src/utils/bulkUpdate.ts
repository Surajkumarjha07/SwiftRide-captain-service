import captainCoordsMap from "../captainCoordsMap.js";
import _ from "lodash";
import bulkInsertDB from "./bulkInsertDB.js";

async function bulkUpdateLocation() {
    try {
        let buffer: any[];

        setInterval(async () => {
            buffer = Array.from(captainCoordsMap.entries());

            if (buffer.length === 0) return;

            const chunks = _.chunk(buffer, 10);

            try {
                await bulkInsertDB(chunks);

                captainCoordsMap.clear();

            } catch (error) {
                throw new Error("Error in bulk inserting in DB: " + (error as Error).message);
            }

        }, 60 * 1000);

    } catch (error) {
        throw new Error("Error in bulk updating database: " + (error as Error).message);
    }
}

export default bulkUpdateLocation;