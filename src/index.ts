import express, { Request, Response } from "express";
import dotenv from "dotenv";
import captainRoutes from "./routes/captainRoutes.js";
import cookieParser from "cookie-parser";
import rideRoutes from "./routes/rideRoutes.js";
import startKafka from "./kafka/index.js";
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
bulkUpdateLocation();

app.use("/actions", captainRoutes);
app.use("/rides", rideRoutes);
// app.post("/loc", async (req, res) => {
//   const { locationCoordinates } = req.body;

//   try {
//     const captains = await findCaptains(locationCoordinates, 5);
//     res.json(captains);
//   } catch (error) {
//     console.error("Error finding captains:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(Number(process.env.PORT), () => {
    console.log("Captain service is running!");
})