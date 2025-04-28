import { rideService } from "../../services/rideService.js";

async function handleRideAccepted(req, res) {
    try {
        const { id } = req.captain;
        if (!id) {
            return res.status(400).json({
                message: "Captain not authorized"
            })
        }

        await rideService.rideAccept(id);
        
        res.status(200).json({
            message: `Ride accepted by: ${id}`
        })

    } catch (error) {
        console.log("error in accepting ride!");
    }
}

export default handleRideAccepted;