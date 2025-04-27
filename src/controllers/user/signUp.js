import { userService } from "../../services/userService.js";

async function handleRegisterCaptain(req, res) {
    try {
        const { email, name, password, role, location } = req.body;

        if (!email || !name || !password || !role || !location) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const captain = await userService.signUpUser({ email, name, password, role, location });

        res.status(200).json({
            message: "Captain created!",
            captain
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleRegisterCaptain;