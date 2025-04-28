import { rideService } from "../../services/rideService.js";

async function handleRideCompleted(req, res) {
    try {
        const { id } = req.captain;

        if (!id) {
            return res.status(400).json({
                message: "Id not available"
            })
        }

        await rideService.rideComplete(id);

        res.status(200).json({
            message: "ride completed!"
        })

    } catch (error) {
        console.log("error in completing ride! ", error);
    }
}

export default handleRideCompleted;