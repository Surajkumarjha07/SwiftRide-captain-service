import producer from "../../kafka/producerInIt.js";
import { PrismaClient, availability } from "@prisma/client";

const prisma = new PrismaClient(); 

async function handleRideAccepted(req, res) {
    try {
        const { id } = req.captain;
        if (!id) {
            return res.status(400).json({
                message: "Captain not authorized"
            })
        }

        await producer.sendProducerMessage("ride-accepted", id);
        await prisma.captains.update({
            where: {captainId: id},
            data:{
                isAvailable: availability.UNAVAILABLE
            }
        })

        res.status(200).json({
            message: `Ride accepted by: ${id}`
        })

    } catch (error) {
        console.log("error in accepting ride!");
    }
}

export default handleRideAccepted;