import { availability, PrismaClient } from "@prisma/client";
import producer from "../../kafka/producerInIt.js";

const prisma = new PrismaClient();

async function handleRideCompleted(req, res) {
    try {
        const { id } = req.captain;

        if (!id) {
            return res.status(400).json({
                message: "Id not available"
            })
        }

        await prisma.captains.update({
            where: { captainId: id },
            data: {
                isAvailable: availability.AVAILABLE
            }
        })

        await producer.sendProducerMessage("ride-completed", id);        

        res.status(200).json({
            message: "ride completed!"
        })

    } catch (error) {
        console.log("error in completing ride! ", error);        
    }
}

export default handleRideCompleted;