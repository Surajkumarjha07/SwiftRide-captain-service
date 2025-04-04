import kafka from "./kafkaClient.js"
import captain from "../controllers/assignCaptain.js";
import producer from "./producer.js";

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const acceptRideConsumer = kafka.consumer({groupId: "accept-ride-group"});

async function consumerInit() {
    await getCaptainConsumer.connect();
    await acceptRideConsumer.connect();
}

async function getCaptainRequest() {
    try {
        await getCaptainConsumer.subscribe({ topic: "get-captains", fromBeginning: true })
        await getCaptainConsumer.run({
            eachMessage: async ({ message }) => {
                const location = JSON.parse(message.value).location;
                if (location) {   
                    console.log(`message from ride-service: ${location}`);
                    
                    const captains = await captain.findCaptain(location);
                    await producer.sendProducerMessage("captains-fetched", captains);
                }
            }
        })
    } catch (error) {
        console.log("error in getting captain request: ", error);
    }
}

async function acceptRide() {
    try {
        await acceptRideConsumer.subscribe({topic: "accept-ride", fromBeginning: true});
        await acceptRideConsumer.run({
            eachMessage: async ({message}) => {
                console.log("accept-ride: ", message.value.toString());                
            }
        })
    } catch (error) {
        console.log("error in getting accept ride request: ", error);
    }
}

export default { consumerInit, getCaptainRequest, acceptRide };