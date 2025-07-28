import express, { Request, Response } from "express";
import dotenv from "dotenv";
import captainRoutes from "./routes/actions.routes.js";
import cookieParser from "cookie-parser";
import rideRoutes from "./routes/rides.routes.js";
import startKafka from "./kafka/index.kafka.js";
import bulkUpdateLocation from "./utils/bulkUpdate.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello! I am captain-service");
})

// start kafka
startKafka();

// timely updates the location in the database
bulkUpdateLocation();

app.use("/actions", captainRoutes);
app.use("/rides", rideRoutes);

app.listen(Number(process.env.PORT), () => {
    console.log("Captain service is running!");
})