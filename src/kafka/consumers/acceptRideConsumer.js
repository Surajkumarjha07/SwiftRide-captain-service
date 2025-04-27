import acceptRideHandler from "../handlers/acceptRideHandler.js";

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

export default acceptRide;