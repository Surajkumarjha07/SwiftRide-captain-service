import express from "express";
import dotenv from "dotenv";
import captainRoutes from "./routes/captainRoutes.js";
import cookieParser from "cookie-parser";
import kafkaInit from "./kafka/kafkaAdmin.js";
import consumer from "./kafka/consumer.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello! I am captain-service");
})

// kafka setup

const startKafka = async () => {
    try {
        await kafkaInit();

        console.log("Consumer initialization...");
        await consumer.consumerInit();
        console.log("Consumer initialized...");
        await consumer.getCaptainRequest();
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

startKafka(); 

app.use("/actions", captainRoutes);

app.listen(process.env.PORT, () => {
    console.log("Captain service is running!");
})