// src/index.ts
import express2 from "express";
import dotenv3 from "dotenv";

// src/routes/actions.routes.ts
import express from "express";

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/services/actions.services/deleteCaptain.service.ts
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
var deleteCaptain_service_default = deleteCaptain;

// src/services/actions.services/logInCaptain.service.ts
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
    const token = jwt.sign(
      {
        captainId: captain.captainId,
        captainEmail: email,
        captainName: captain.name,
        role: captain.role,
        vehicleType: captain.vehicle_type,
        vehicleNo: captain.vehicle_number,
        isVehicleVerified: captain.vehicle_verified
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.log("LogIn service error: ", error.message);
      throw error;
    }
  }
};
var logInCaptain_service_default = logInCaptain;

// src/services/actions.services/signUpCaptain.service.ts
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
var signUpCaptain_service_default = signUpCaptain;

// src/services/actions.services/updateCaptain.service.ts
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
var updateCaptain_service_default = updateCaptain;

// src/services/actions.services/index.service.ts
var captainService = { signUpCaptain: signUpCaptain_service_default, logInCaptain: logInCaptain_service_default, updateCaptain: updateCaptain_service_default, deleteCaptain: deleteCaptain_service_default };

// src/controllers/actions.controllers/update.controller.ts
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
var update_controller_default = handleUpdateCaptainInfo;

// src/controllers/actions.controllers/logIn.controller.ts
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
    if (token) {
      res.cookie("authToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60 * 60 * 1e3,
        path: "/"
      });
    }
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
var logIn_controller_default = handleCaptainLogIn;

// src/controllers/actions.controllers/signUp.controller.ts
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
    res.status(201).json({
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
var signUp_controller_default = handleRegisterCaptain;

// src/controllers/actions.controllers/delete.controller.ts
async function handleDeleteCaptain(req, res) {
  try {
    const { password } = req.body;
    const { captainEmail } = req.captain;
    if (!captainEmail || !password) {
      res.status(400).json({
        message: "Enter all credentials!"
      });
      return;
    }
    const deletedCaptain = await captainService.deleteCaptain({ captainEmail, password });
    res.status(200).json({
      message: "Captain deleted!",
      deletedCaptain
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message || "Internal server error!"
      });
    }
  }
}
var delete_controller_default = handleDeleteCaptain;

// src/middlewares/captainAuth.middleware.ts
import jwt2 from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();
async function captainAuthenticate(req, res, next) {
  let token = req.cookies.authToken || req.headers["authorization"]?.split("Bearer ")[1];
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
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}
var captainAuth_middleware_default = captainAuthenticate;

// src/services/actions.services/registerVehicle.service.ts
import { vehicles, vehicleVerified } from "@prisma/client";
async function registerVehicleService(captainEmail, vehicle, vehicleNo) {
  try {
    const existingVehicle = await database_default.captains.findFirst({
      where: {
        vehicle_number: vehicleNo
      }
    });
    if (existingVehicle) {
      throw new Error("Vehicle already registered!");
    }
    const vehicle_registered = await database_default.captains.update({
      where: {
        email: captainEmail
      },
      data: {
        vehicle_type: vehicle === "SUV" ? vehicles.SUV : vehicle === "bike" ? vehicles.bike : vehicles.car,
        vehicle_number: vehicleNo,
        vehicle_verified: vehicleVerified.VERIFIED
      }
    });
    return vehicle_registered;
  } catch (error) {
    throw new Error("Error in verify-vehicle service: " + error.message);
  }
}
var registerVehicle_service_default = registerVehicleService;

// src/controllers/actions.controllers/registerVehicle.controller.ts
async function registerVehicle(req, res) {
  try {
    const { vehicle, vehicleNo } = req.body;
    const { captainEmail } = req.captain;
    const vehicle_registered = await registerVehicle_service_default(captainEmail, vehicle, vehicleNo);
    if (vehicle_registered) {
      return res.status(200).json({
        message: "Vehicle registered!",
        vehicle_registered
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error!"
    });
  }
}
var registerVehicle_controller_default = registerVehicle;

// src/controllers/actions.controllers/logout.controller.ts
async function handleLogOut(req, res) {
  try {
    return res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    }).status(200).json({
      message: "Logout successful!"
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
var logout_controller_default = handleLogOut;

// src/routes/actions.routes.ts
var router = express.Router();
router.post("/registerCaptain", signUp_controller_default);
router.post("/loginCaptain", logIn_controller_default);
router.put("/updateCaptain", captainAuth_middleware_default, update_controller_default);
router.delete("/deleteCaptain", captainAuth_middleware_default, delete_controller_default);
router.post("/verify-vehicle", captainAuth_middleware_default, registerVehicle_controller_default);
router.post("/logout", logout_controller_default);
var actions_routes_default = router;

// src/index.ts
import cookieParser from "cookie-parser";

// src/routes/rides.routes.ts
import { Router } from "express";

// src/services/rides.services/rideAccept.service.ts
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
    console.log(`${topic} sent`);
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/services/rides.services/rideAccept.service.ts
async function rideAccept(captainId, rideId, vehicle, vehicle_number) {
  try {
    await database_default.captains.updateMany({
      where: { captainId, is_available: availability.AVAILABLE },
      data: {
        is_available: availability.UNAVAILABLE
      }
    });
    const rideData = await redis_default.hgetall(`ride:${rideId}`);
    rideData.captainId = captainId;
    rideData.vehicle = vehicle;
    rideData.vehicle_number = vehicle_number;
    await redis_default.hset(`rideData:${rideData.userId}`, rideData);
    await redis_default.hset(`ride:${rideId}`, rideData);
    await producerTemplate_default("ride-accepted", { captainId, rideData });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride accept service error: ", error.message);
      throw error;
    }
  }
}
var rideAccept_service_default = rideAccept;

// src/services/rides.services/rideComplete.service.ts
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
      await producerTemplate_default("payment-requested-notify-user", { rideData, captainId });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride Complete service error: ", error.message);
      throw error;
    }
  }
}
var rideComplete_service_default = rideComplete;

// src/services/rides.services/index.service.ts
var rideService = { rideAccept: rideAccept_service_default, rideComplete: rideComplete_service_default };

// src/controllers/rides.controllers/rideAccepted.controller.ts
async function handleRideAccepted(req, res) {
  try {
    const { rideId, vehicle, vehicle_number } = req.body;
    const { captainId } = req.captain;
    if (!rideId) {
      res.status(400).json({
        message: "rideId not provided"
      });
      return;
    }
    if (!captainId) {
      res.status(400).json({
        message: "Captain not authorized"
      });
      return;
    }
    const rideData = await redis_default.hgetall(`ride:${rideId}`);
    console.log("rd: ", rideData);
    if (Object.keys(rideData).length === 0) {
      res.status(410).json({
        message: "ride expired!"
      });
      return;
    }
    ;
    if (Object.keys(rideData).includes("captainId")) {
      res.status(409).json({
        message: "ride is already assigned to another captain!"
      });
      return;
    }
    ;
    await rideService.rideAccept(captainId, rideId, vehicle, vehicle_number);
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
var rideAccepted_controller_default = handleRideAccepted;

// src/controllers/rides.controllers/rideCompleted.controller.ts
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
var rideCompleted_controller_default = handleRideCompleted;

// src/routes/rides.routes.ts
var router2 = Router();
router2.route("/acceptRide").post(captainAuth_middleware_default, rideAccepted_controller_default);
router2.route("/rideCompleted").post(captainAuth_middleware_default, rideCompleted_controller_default);
var rides_routes_default = router2;

// src/kafka/consumerInIt.ts
var get_captain_consumer = kafkaClient_default.consumer({ groupId: "get-captain-group" });
var update_captain_earnings_consumer = kafkaClient_default.consumer({ groupId: "update-captain-earnings" });
var ride_cancelled_consumer = kafkaClient_default.consumer({ groupId: "ride-cancelled-group-captain" });
var captain_location_update_consumer = kafkaClient_default.consumer({ groupId: "captain-location-update" });
async function consumerInit() {
  await Promise.all([
    get_captain_consumer.connect(),
    update_captain_earnings_consumer.connect(),
    ride_cancelled_consumer.connect(),
    captain_location_update_consumer.connect()
  ]);
}

// src/captainCoordsMap.ts
var captainCoordsMap = /* @__PURE__ */ new Map();
var captainCoordsMap_default = captainCoordsMap;

// src/kafka/handlers/locationUpdate.handler.ts
async function captainLocationUpdateHandler({ message }) {
  try {
    const { coordinates, captainId } = JSON.parse(message.value.toString());
    const captain_redis_coord = await redis_default.hgetall(`captain-location-updates:${captainId}`);
    const latitudeChanged = coordinates.latitude !== Number(captain_redis_coord.latitude);
    const longitudeChanged = coordinates.longitude !== Number(captain_redis_coord.longitude);
    if (!latitudeChanged && !longitudeChanged) return;
    await redis_default.hset(`captain-location-updates:${captainId}`, { latitude: String(coordinates.latitude), longitude: String(coordinates.longitude) });
    await redis_default.expire(`captain-location-updates:${captainId}`, 3600);
    captainCoordsMap_default.set(captainId, coordinates);
  } catch (error) {
    throw new Error("Error in Captain-Location-Update handler: " + error.message);
  }
}
var locationUpdate_handler_default = captainLocationUpdateHandler;

// src/kafka/consumers/locationUpdate.consumer.ts
async function captainLocationUpdate() {
  try {
    await captain_location_update_consumer.subscribe({ topic: "captain-location-update", fromBeginning: true });
    await captain_location_update_consumer.run({
      eachMessage: locationUpdate_handler_default
    });
  } catch (error) {
    throw new Error("Error in Captain-Location-Update consumer: " + error.message);
  }
}
var locationUpdate_consumer_default = captainLocationUpdate;

// src/kafka/handlers/captainPayment.handler.ts
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
      throw new Error(`Error in update-captain-payment handler: ${error.message}`);
    }
  }
}
var captainPayment_handler_default = captainPaymentHandler;

// src/kafka/consumers/captainPayment.consumer.ts
async function captainPayment() {
  try {
    await update_captain_earnings_consumer.subscribe({ topic: "update-captain-earnings", fromBeginning: true });
    await update_captain_earnings_consumer.run({
      eachMessage: captainPayment_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in update-captain-earnings consumer: ${error.message}`);
    }
  }
}
var captainPayment_consumer_default = captainPayment;

// src/utils/findCaptains.ts
import { availability as availability3, vehicleVerified as vehicleVerified2 } from "@prisma/client";
import { getBoundsOfDistance } from "geolib";
async function findCaptains(locationCoordinates, vehicle, radius) {
  try {
    const { pickUpLocation_latitude: userLatitude, pickUpLocation_longitude: userLongitude } = locationCoordinates;
    const radiusInMeter = radius * 1e3;
    const bounds = getBoundsOfDistance(
      { latitude: userLatitude, longitude: userLongitude },
      radiusInMeter
    );
    const [sw, ne] = bounds;
    const captains = await database_default.$queryRaw`
            SELECT *,
            ST_distance_sphere(
                    point(${userLongitude}, ${userLatitude}),
                    point(longitude, latitude)
            ) AS Distance
            FROM captains
            WHERE
                latitude BETWEEN ${sw.latitude} AND ${ne.latitude}
                AND
                longitude BETWEEN ${sw.longitude} AND ${ne.longitude}
                AND
                vehicle_type=${vehicle}
                AND
                is_available=${availability3.AVAILABLE}
                AND
                vehicle_verified=${vehicleVerified2.VERIFIED}
                AND
                ST_distance_sphere(
                    point(${userLongitude}, ${userLatitude}),
                    point(longitude, latitude)
                ) <= ${radiusInMeter}
                ORDER BY Distance ASC
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

// src/kafka/handlers/getCaptain.handler.ts
async function getCaptainHandler({ message }) {
  const rideData = JSON.parse(message.value.toString());
  const { rideId, vehicle } = rideData;
  const { pickUpLocation_latitude, pickUpLocation_longitude } = rideData;
  let captains = [];
  if (pickUpLocation_latitude && pickUpLocation_longitude) {
    console.log("Finding captains near:", pickUpLocation_latitude, pickUpLocation_longitude);
    captains = await findCaptains_default({ pickUpLocation_latitude, pickUpLocation_longitude }, vehicle, 5);
  }
  console.log("captains found: ", captains);
  if (captains.length === 0) {
    await producerTemplate_default("no-captain-found-notify-ride", { rideData });
    await producerTemplate_default("no-captain-found-notify-gateway", { rideData });
    await producerTemplate_default("no-captain-found-notify-user", { rideData });
    return;
  }
  await producerTemplate_default("captains-fetched", { captains, rideData });
  await redis_default.hset(`ride:${rideId}`, rideData);
}
var getCaptain_handler_default = getCaptainHandler;

// src/kafka/consumers/getCaptain.consumer.ts
async function getCaptainRequest() {
  try {
    await get_captain_consumer.subscribe({ topic: "get-captains", fromBeginning: true });
    await get_captain_consumer.run({
      eachMessage: getCaptain_handler_default
    });
  } catch (error) {
    console.log("error in getting get-captains request: ", error);
  }
}
var getCaptain_consumer_default = getCaptainRequest;

// src/kafka/handlers/rideCancelled.handler.ts
import { availability as availability4 } from "@prisma/client";
async function rideCancelledHandler({ message }) {
  try {
    const { rideData } = JSON.parse(message.value.toString());
    const { captainId } = rideData;
    await database_default.captains.update({
      where: {
        captainId
      },
      data: {
        is_available: availability4.AVAILABLE
      }
    });
    await producerTemplate_default("ride-cancelled-notify-captain", { rideData });
  } catch (error) {
    throw new Error("Error in getting ride-cancelled handler(captain): " + error.message);
  }
}
var rideCancelled_handler_default = rideCancelledHandler;

// src/kafka/consumers/rideCancelled.consumer.ts
async function rideCancelled() {
  try {
    await ride_cancelled_consumer.subscribe({ topic: "ride-cancelled" });
    await ride_cancelled_consumer.run({
      eachMessage: rideCancelled_handler_default
    });
  } catch (error) {
    throw new Error("Error in getting ride-cancelled consumer(captain): " + error.message);
  }
}
var rideCancelled_consumer_default = rideCancelled;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["ride-cancelled", "captain-location-update", "update-captain-earnings", "get-captains"];
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

// src/kafka/index.kafka.ts
var startKafka = async () => {
  try {
    await kafkaAdmin_default();
    console.log("Consumer initialization...");
    await consumerInit();
    console.log("Consumer initialized...");
    console.log("Producer initialization...");
    await producerInit();
    console.log("Producer initializated");
    await getCaptain_consumer_default();
    await captainPayment_consumer_default();
    await locationUpdate_consumer_default();
    await rideCancelled_consumer_default();
  } catch (error) {
    console.log("error in initializing kafka: ", error);
  }
};
var index_kafka_default = startKafka;

// src/utils/bulkUpdate.ts
import _ from "lodash";

// src/utils/bulkInsertDB.ts
async function bulkInsertDB(chunks) {
  for (const chunk of chunks) {
    const ids = chunk.map(([captainId, coordinates]) => `'${captainId}'`).join(", ");
    const latitudeCases = chunk.map(([captainId, coordinates]) => `WHEN '${captainId}' THEN ${coordinates.latitude}`).join(" ");
    const longitudeCases = chunk.map(([captainId, coordinates]) => `WHEN '${captainId}' THEN ${coordinates.longitude}`).join(" ");
    const query = `
                UPDATE captains
                SET 
                latitude = CASE captainId ${latitudeCases} END,
                longitude = CASE captainId ${longitudeCases} END
                WHERE captainId IN (${ids})
            `;
    await database_default.$executeRawUnsafe(query);
  }
}
var bulkInsertDB_default = bulkInsertDB;

// src/utils/bulkUpdate.ts
async function bulkUpdateLocation() {
  try {
    let buffer;
    setInterval(async () => {
      buffer = Array.from(captainCoordsMap_default.entries());
      if (buffer.length === 0) return;
      const chunks = _.chunk(buffer, 10);
      try {
        await bulkInsertDB_default(chunks);
        captainCoordsMap_default.clear();
      } catch (error) {
        throw new Error("Error in bulk inserting in DB: " + error.message);
      }
    }, 60 * 1e3);
  } catch (error) {
    throw new Error("Error in bulk updating database: " + error.message);
  }
}
var bulkUpdate_default = bulkUpdateLocation;

// src/index.ts
dotenv3.config();
var app = express2();
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello! I am captain-service");
});
index_kafka_default();
bulkUpdate_default();
app.use("/actions", actions_routes_default);
app.use("/rides", rides_routes_default);
app.listen(Number(process.env.PORT), () => {
  console.log("Captain service is running!");
});
