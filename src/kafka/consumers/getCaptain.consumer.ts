import { get_captain_consumer } from "../consumerInIt.js";
import getCaptainHandler from "../handlers/getCaptain.handler.js";

async function getCaptainRequest() {
    try {
        await get_captain_consumer.subscribe({ topic: "get-captains", fromBeginning: true })
        await get_captain_consumer.run({
            eachMessage: getCaptainHandler
        })
    } catch (error) {
        console.log("error in getting get-captains request: ", error);
    }
}

export default getCaptainRequest;