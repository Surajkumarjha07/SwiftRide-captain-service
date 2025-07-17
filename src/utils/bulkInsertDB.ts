import prisma from "../config/database.js";

async function bulkInsertDB(chunks: Array<any>): Promise<any> {

    for (const chunk of chunks) {
        const ids = chunk.map(([captainId, coordinates]: any) => (
            `'${captainId}'`
        )).join(", ");

        const latitudeCases = chunk.map(([captainId, coordinates]: any) => (
            `WHEN '${captainId}' THEN ${coordinates.latitude}`
        )).join(" ");

        const longitudeCases = chunk.map(([captainId, coordinates]: any) => (
            `WHEN '${captainId}' THEN ${coordinates.longitude}`
        )).join(" ");

        const query = `
                UPDATE captains
                SET 
                latitude = CASE captainId ${latitudeCases} END,
                longitude = CASE captainId ${longitudeCases} END
                WHERE captainId IN (${ids})
            `
        await prisma.$executeRawUnsafe(query);
    }

}

export default bulkInsertDB;