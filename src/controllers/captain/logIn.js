import { captainService } from "../../services/captainService.js";

async function handleCaptainLogIn(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const token = await captainService.logInCaptain({ email, password })

        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "User Logged In!",
            token
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleCaptainLogIn;