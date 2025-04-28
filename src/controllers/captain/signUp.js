import { captainService } from "../../services/captainService.js";

async function handleRegisterCaptain(req, res) {
    try {
        const { email, name, password, role, location } = req.body;

        if (!email || !name || !password || !role || !location) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const captain = await captainService.signUpCaptain({ email, name, password, role, location });

        res.status(200).json({
            message: "Captain created!",
            captain
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleRegisterCaptain;