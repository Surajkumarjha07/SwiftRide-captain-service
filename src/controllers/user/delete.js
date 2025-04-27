import { userService } from "../../services/userService.js";

async function handleDeleteCaptain(req, res) {
    try {
        const { password } = req.body;
        const { email } = req.captain;

        const deletedCaptain = await userService.deleteUser({email, password})

        res.status(200).json({
            message: "Captain deleted!",
            deletedCaptain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleDeleteCaptain;