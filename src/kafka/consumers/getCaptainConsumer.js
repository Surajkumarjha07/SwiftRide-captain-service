import getCaptainHandler from "../handlers/getCaptainHandler.js";
import { getCaptainConsumer } from "../consumerInIt.js";

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

export default getCaptainRequest;