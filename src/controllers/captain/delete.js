import { captainService } from "../../services/captainService.js";

async function handleDeleteCaptain(req, res) {
    try {
        const { password } = req.body;
        const { email } = req.captain;

        const deletedCaptain = await captainService.deleteCaptain({email, password})

        res.status(200).json({
            message: "Captain deleted!",
            deletedCaptain
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleDeleteCaptain;