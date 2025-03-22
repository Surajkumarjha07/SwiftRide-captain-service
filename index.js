import express from "express";
import dotenv from "dotenv";
import captainRoutes from "./routes/captainRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello! I am captain-service");
})

app.use("/actions", captainRoutes);

app.listen(process.env.PORT, () => {
    console.log("Captain service is running!");
})