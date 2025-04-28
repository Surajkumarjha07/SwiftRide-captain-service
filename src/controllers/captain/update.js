import { captainService } from "../../services/captainService.js";

async function handleUpdateCaptainInfo(req, res) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.captain;

        const updatedCaptain = await captainService.updateCaptain({ newEmail, newName, newRole, newPassword, oldPassword, email })

        res.status(200).json({
            message: "Captain updated!",
            updatedCaptain
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleUpdateCaptainInfo;