// src/index.ts
import express2 from "express";
import dotenv3 from "dotenv";

// src/routes/captainRoutes.ts
import express from "express";

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/services/captainServices/deleteCaptainService.ts
import bcrypt from "bcryptjs";
var deleteCaptain = async ({ captainEmail, password }) => {
  try {
    const captain = await database_default.captains.findFirst({ where: { email: captainEmail } });
    if (!captain) {
      throw new Error("Captain doesn't exist!");
    }
    let passwordMatched;
    if (captain) {
      passwordMatched = await bcrypt.compare(password, captain.password);
    }
    if (!passwordMatched) {
      throw new Error("Incorrect Password!");
    }
    const deletedCaptain = await database_default.captains.delete({ where: { email: captainEmail } });
    return deletedCaptain;
  } catch (error) {
    if (error instanceof Error) {
      console.log("delete service error: ", error.message);
      throw error;
    }
  }
};
var deleteCaptainService_default = deleteCaptain;

// src/services/captainServices/logInCaptainService.ts
import bcrypt2 from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var logInCaptain = async ({ email, password }) => {
  try {
    const captain = await database_default.captains.findFirst({ where: { email } });
    let passwordMatched;
    if (captain) {
      passwordMatched = await bcrypt2.compare(password, captain.password);
    }
    if (!captain || !passwordMatched) {
      throw new Error("Incorrect email or password!");
    }
    const token = jwt.sign({ captainEmail: email, captainId: captain.captainId, captainName: captain.name, role: captain.role, vehicleType: captain.vehicle_type, vehicleNo: captain.vehicle_number, isVehicleVerified: captain.vehicle_verified }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.log("LogIn service error: ", error.message);
      throw error;
    }
  }
};
var logInCaptainService_default = logInCaptain;

// src/services/captainServices/signUpCaptainService.ts
import bcrypt3 from "bcryptjs";
var signUpCaptain = async ({ email, name, password, role, latitude, longitude }) => {
  try {
    const existingCaptain = await database_default.captains.findFirst({ where: { email } });
    if (existingCaptain) {
      throw new Error("Email already exists!");
    }
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
    let captainId = "";
    for (let i = 0; i < 15; i++) {
      let pos = Math.floor(Math.random() * alpha.length);
      captainId = captainId + alpha[pos];
    }
    const saltRounds = 10;
    const salt = await bcrypt3.genSalt(saltRounds);
    const hashedPassword = await bcrypt3.hash(password, salt);
    return await database_default.captains.create({ data: { email: email.trim(), name: name.trim(), password: hashedPassword.trim(), role: role.trim(), latitude, longitude, captainId: captainId.trim() } });
  } catch (error) {
    if (error instanceof Error) {
      console.log("SignUp service error: ", error.message);
      throw error;
    }
  }
};
var signUpCaptainService_default = signUpCaptain;

// src/services/captainServices/updateCaptainService.ts
import bcrypt4 from "bcryptjs";
var updateCaptain = async ({ newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword, captainEmail }) => {
  try {
    const captain = await database_default.captains.findFirst({
      where: { email: captainEmail }
    });
    let passwordMatched;
    if (captain && oldPassword) {
      passwordMatched = await bcrypt4.compare(oldPassword, captain.password);
    }
    if (!passwordMatched || !captain) {
      throw new Error("Incorrect Email or Password!");
    }
    let updateData = {};
    if (newPassword) {
      const saltRounds = 10;
      const salt = await bcrypt4.genSalt(saltRounds);
      updateData.password = await bcrypt4.hash(newPassword, salt);
    }
    if (newEmail) {
      updateData.email = newEmail;
    }
    if (newName) {
      updateData.name = newName;
    }
    if (newVehicleType) {
      updateData.vehicle_type = newVehicleType;
    }
    if (newVehicleNo) {
      updateData.vehicle_number = newVehicleNo;
    }
    const updatedCaptain = await database_default.captains.update({
      where: { email: captainEmail },
      data: updateData
    });
    return updatedCaptain;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Update service error: ", error.message);
      throw error;
    }
  }
};
var updateCaptainService_default = updateCaptain;

// src/services/captainServices/index.ts
var captainService = { signUpCaptain: signUpCaptainService_default, logInCaptain: logInCaptainService_default, updateCaptain: updateCaptainService_default, deleteCaptain: deleteCaptainService_default };

// src/controllers/captain/update.ts
async function handleUpdateCaptainInfo(req, res) {
  try {
    const { newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword } = req.body;
    const { captainEmail } = req.captain;
    const updatedCaptain = await captainService.updateCaptain({ newEmail, newName, newPassword, newVehicleType, newVehicleNo, oldPassword, captainEmail });
    res.status(200).json({
      message: "Captain updated!",
      updatedCaptain
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var update_default = handleUpdateCaptainInfo;

// src/controllers/captain/logIn.ts
async function handleCaptainLogIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Enter required details!"
      });
      return;
    }
    const token = await captainService.logInCaptain({ email, password });
    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1e3,
      path: "/"
    });
    res.status(200).json({
      message: "User Logged In!",
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
    }
  }
}
var logIn_default = handleCaptainLogIn;

// src/controllers/captain/signUp.ts
async function handleRegisterCaptain(req, res) {
  try {
    const { email, name, password, role, latitude, longitude } = req.body;
    if (!email || !name || !password || !role) {
      res.status(400).json({
        message: "Enter required details!"
      });
      return;
    }
    const captain = await captainService.signUpCaptain({ email, name, password, role, latitude, longitude });
    res.status(200).json({
      message: "Captain created!",
      captain
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var signUp_default = handleRegisterCaptain;

// src/controllers/captain/delete.ts
async function handleDeleteCaptain(req, res) {
  try {
    const { password } = req.body;
    const { captainEmail } = req.captain;
    const deletedCaptain = await captainService.deleteCaptain({ captainEmail, password });
    res.status(200).json({
      message: "Captain deleted!",
      deletedCaptain
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
    }
  }
}
var delete_default = handleDeleteCaptain;

// src/middlewares/captainAuth.ts
import jwt2 from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();
async function captainAuthenticate(req, res, next) {
  let token = req.cookies.authtoken || req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) {
    res.status(404).json({ message: "token not available" });
    return;
  }
  try {
    const verified = jwt2.verify(token, process.env.JWT_SECRET);
    if (verified) {
      req.captain = verified;
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}
var captainAuth_default = captainAuthenticate;

// src/routes/captainRoutes.ts
var router = express.Router();
router.post("/registerCaptain", signUp_default);
router.post("/loginCaptain", logIn_default);
router.put("/updateCaptain", captainAuth_default, update_default);
router.delete("/deleteCaptain", captainAuth_default, delete_default);
var captainRoutes_default = router;

// src/index.ts
import cookieParser from "cookie-parser";

// src/routes/rideRoutes.ts
import { Router } from "express";

// src/services/rideServices/rideAccept.ts
import { availability } from "@prisma/client";

// src/config/redis.ts
import { Redis } from "ioredis";
var redis = new Redis();
var redis_default = redis;

// src/kafka/producerInIt.ts
import { Partitioners } from "kafkajs";

// src/kafka/kafkaClient.ts
import { Kafka, logLevel } from "kafkajs";
var kafka = new Kafka({
  clientId: "captain-service",
  brokers: ["localhost:9092"],
  connectionTimeout: 1e4,
  requestTimeout: 3e4,
  retry: {
    initialRetryTime: 2e3,
    retries: 10
  },
  logLevel: logLevel.ERROR
});
var kafkaClient_default = kafka;

// src/kafka/producerInIt.ts
var producer = kafkaClient_default.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
async function producerInit() {
  await producer.connect();
}

// src/kafka/producers/producerTemplate.ts
async function sendProducerMessage(topic, data) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }]
    });
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/services/rideServices/rideAccept.ts
async function rideAccept(captainId, rideId) {
  try {
    await database_default.captains.updateMany({
      where: { captainId, is_available: availability.AVAILABLE },
      data: {
        is_available: availability.UNAVAILABLE
      }
    });
    const rideData = await redis_default.hgetall(`ride:${rideId}`);
    await producerTemplate_default("ride-accepted", { captainId, rideData });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride accept service error: ", error.message);
      throw error;
    }
  }
}
var rideAccept_default = rideAccept;

// src/services/rideServices/rideComplete.ts
import { availability as availability2 } from "@prisma/client";
async function rideComplete(captainId, rideId) {
  try {
    await database_default.captains.updateMany({
      where: { captainId, is_available: availability2.UNAVAILABLE },
      data: {
        is_available: availability2.AVAILABLE
      }
    });
    const rideData = await redis_default.hgetall(`ride:${rideId}`);
    if (captainId && rideData) {
      await producerTemplate_default("payment-requested", { captainId, rideData });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride Complete service error: ", error.message);
      throw error;
    }
  }
}
var rideComplete_default = rideComplete;

// src/services/rideServices/index.ts
var rideService = { rideAccept: rideAccept_default, rideComplete: rideComplete_default };

// src/controllers/ride/rideAccepted.ts
async function handleRideAccepted(req, res) {
  try {
    const { rideId } = req.body;
    const { captainId } = req.captain;
    if (!captainId) {
      res.status(400).json({
        message: "Captain not authorized"
      });
      return;
    }
    await rideService.rideAccept(captainId, rideId);
    res.status(200).json({
      message: `Ride accepted by: ${captainId}`
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
    }
  }
}
var rideAccepted_default = handleRideAccepted;

// src/controllers/ride/rideCompleted.ts
async function handleRideCompleted(req, res) {
  try {
    const { rideId } = req.body;
    const { captainId } = req.captain;
    if (!captainId) {
      res.status(400).json({
        message: "Id not available"
      });
      return;
    }
    await rideService.rideComplete(captainId, rideId);
    res.status(200).json({
      message: "ride completed!"
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
    }
  }
}
var rideCompleted_default = handleRideCompleted;

// src/routes/rideRoutes.ts
var router2 = Router();
router2.route("/acceptRide").post(captainAuth_default, rideAccepted_default);
router2.route("/rideCompleted").post(captainAuth_default, rideCompleted_default);
var rideRoutes_default = router2;

// src/kafka/consumerInIt.ts
var getCaptainConsumer = kafkaClient_default.consumer({ groupId: "get-captain-group" });
var acceptRideConsumer = kafkaClient_default.consumer({ groupId: "accept-ride-group" });
var rideSavedConsumer = kafkaClient_default.consumer({ groupId: "ride-saved-group" });
var captain_payment_consumer = kafkaClient_default.consumer({ groupId: "captain-payment" });
async function consumerInit() {
  await Promise.all([
    getCaptainConsumer.connect(),
    acceptRideConsumer.connect(),
    rideSavedConsumer.connect(),
    captain_payment_consumer.connect()
  ]);
}

// src/kafka/handlers/acceptRideHandler.ts
async function acceptRideHandler({ message }) {
  try {
    const { captain, rideData } = JSON.parse(message.value.toString());
    const { rideId } = rideData;
    await redis_default.hmset(`ride:${rideId}`, rideData);
    await redis_default.expire(`ride:${rideId}`, 24 * 3600);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error in acceptRideHandler: " + error.message);
    }
  }
}
var acceptRideHandler_default = acceptRideHandler;

// src/kafka/consumers/acceptRideConsumer.ts
async function acceptRide() {
  try {
    await acceptRideConsumer.subscribe({ topic: "accept-ride", fromBeginning: true });
    await acceptRideConsumer.run({
      eachMessage: acceptRideHandler_default
    });
  } catch (error) {
    console.log("error in getting accept-ride request: ", error);
  }
}
var acceptRideConsumer_default = acceptRide;

// src/kafka/handlers/captainPaymentHandler.ts
async function captainPaymentHandler({ message }) {
  try {
    const { fare, payment_id, orderId, order, userId, rideId, captainId } = JSON.parse(message.value.toString());
    const { captain_commission } = order;
    await database_default.captains.update({
      where: {
        captainId
      },
      data: {
        total_earnings: {
          increment: captain_commission
        }
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in captain-payment handler: ${error.message}`);
    }
  }
}
var captainPaymentHandler_default = captainPaymentHandler;

// src/kafka/consumers/captainPaymentConsumer.ts
async function captainPayment() {
  try {
    await captain_payment_consumer.subscribe({ topic: "captain-payment", fromBeginning: true });
    await captain_payment_consumer.run({
      eachMessage: captainPaymentHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in captain-payment consumer: ${error.message}`);
    }
  }
}
var captainPaymentConsumer_default = captainPayment;

// src/utils/findCaptains.ts
import { availability as availability3 } from "@prisma/client";
import { getBoundsOfDistance } from "geolib";
async function findCaptains(locationCoordinates, radius) {
  try {
    const { pickUpLocation_latitude: userLatitude, pickUpLocation_longitude: userLongitude } = locationCoordinates;
    const radiusInMeter = radius * 1e3;
    const bounds = getBoundsOfDistance(
      { latitude: userLatitude, longitude: userLongitude },
      radiusInMeter
    );
    const [sw, ne] = bounds;
    const captains = await database_default.$queryRaw`
            SELECT * FROM captains
            WHERE
                latitude BETWEEN ${sw.latitude} AND ${ne.latitude}
                AND
                longitude BETWEEN ${sw.longitude} AND ${ne.longitude}
                AND
                is_available=${availability3.AVAILABLE}
                AND
                ST_distance_sphere(
                    point(${userLatitude}, ${userLongitude}),
                    point(latitude, longitude)
                ) <= ${radiusInMeter}
            `;
    return captains;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Find captain service error: ", error.message);
      throw error;
    }
  }
}
var findCaptains_default = findCaptains;

// src/kafka/handlers/getCaptainHandler.ts
async function getCaptainHandler({ message }) {
  const rideData = JSON.parse(message.value.toString());
  const { pickUpLocation_latitude, pickUpLocation_longitude } = rideData;
  if (pickUpLocation_latitude && pickUpLocation_longitude) {
    const captains = await findCaptains_default({ pickUpLocation_latitude, pickUpLocation_longitude }, 5);
    if (!captains) {
      await producerTemplate_default("no-captain-found", { rideData });
    }
    await producerTemplate_default("captains-fetched", { captains, rideData });
  }
}
var getCaptainHandler_default = getCaptainHandler;

// src/kafka/consumers/getCaptainConsumer.ts
async function getCaptainRequest() {
  try {
    await getCaptainConsumer.subscribe({ topic: "get-captains", fromBeginning: true });
    await getCaptainConsumer.run({
      eachMessage: getCaptainHandler_default
    });
  } catch (error) {
    console.log("error in getting get-captains request: ", error);
  }
}
var getCaptainConsumer_default = getCaptainRequest;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["ride-accepted"];
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics.filter((t) => !existingTopics.includes(t));
  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate.map((t) => ({ topic: t, numPartitions: 1 }))
    });
  }
  console.log("Topics created!");
  await admin.disconnect();
}
var kafkaAdmin_default = kafkaInit;

// src/kafka/index.ts
var startKafka = async () => {
  try {
    await kafkaAdmin_default();
    console.log("Consumer initialization...");
    await consumerInit();
    console.log("Consumer initialized...");
    console.log("Producer initialization...");
    await producerInit();
    console.log("Producer initializated");
    await getCaptainConsumer_default();
    await acceptRideConsumer_default();
    await captainPaymentConsumer_default();
  } catch (error) {
    console.log("error in initializing kafka: ", error);
  }
};
var kafka_default = startKafka;

// src/index.ts
dotenv3.config();
var app = express2();
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello! I am captain-service");
});
kafka_default();
app.use("/actions", captainRoutes_default);
app.use("/rides", rideRoutes_default);
app.post("/loc", async (req, res) => {
  const { locationCoordinates } = req.body;
  try {
    const captains = await findCaptains_default(locationCoordinates, 5);
    res.json(captains);
  } catch (error) {
    console.error("Error finding captains:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(Number(process.env.PORT), () => {
  console.log("Captain service is running!");
});
