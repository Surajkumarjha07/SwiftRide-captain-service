import express, { Request, Response } from "express";
import dotenv from "dotenv";
import captainRoutes from "./routes/captainRoutes.js";
import cookieParser from "cookie-parser";
import rideRoutes from "./routes/rideRoutes.js";
import startKafka from "./kafka/index.js";
import CaptainPayload from "./types/captainPayload.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello! I am captain-service");
})

// start kafka
startKafka();

app.use("/actions", captainRoutes);
app.use("/rides", rideRoutes);

app.listen(Number(process.env.PORT), () => {
    console.log("Captain service is running!");
})