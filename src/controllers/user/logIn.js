import { userService } from "../../services/userService.js";

async function handleCaptainLogIn(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const token = await userService.logInUser({ email, password })

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
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleCaptainLogIn;