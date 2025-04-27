import { userService } from "../../services/userService.js";

async function handleUpdateCaptainInfo(req, res) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.captain;

        const updatedCaptain = await userService.updateUser({newEmail, newName, newRole, newPassword, oldPassword, email})

        res.status(200).json({
            message: "Captain updated!",
            updatedCaptain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleUpdateCaptainInfo;