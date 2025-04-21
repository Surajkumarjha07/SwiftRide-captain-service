import kafka from "./kafkaClient.js"
import getCaptainHandler from "./handlers/getCaptainHandler.js";
import acceptRideHandler from "./handlers/acceptRideHandler.js";

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const acceptRideConsumer = kafka.consumer({ groupId: "accept-ride-group" });

async function consumerInit() {
    await Promise.all([
        getCaptainConsumer.connect(),
        acceptRideConsumer.connect()
    ])
}

async function getCaptainRequest() {
    try {
        await getCaptainConsumer.subscribe({ topic: "get-captains", fromBeginning: true })
        await getCaptainConsumer.run({
            eachMessage: getCaptainHandler
        })
    } catch (error) {
        console.log("error in getting get-captains request: ", error);
    }
}

async function acceptRide() {
    try {
        await acceptRideConsumer.subscribe({ topic: "accept-ride", fromBeginning: true });
        await acceptRideConsumer.run({
            eachMessage: acceptRideHandler
        })
    } catch (error) {
        console.log("error in getting accept-ride request: ", error);
    }
}

export default { consumerInit, getCaptainRequest, acceptRide };