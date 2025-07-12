import { ride_cancelled_consumer } from "../consumerInIt.js";
import rideCancelledHandler from "../handlers/rideCancelledHandler.js";

async function rideCancelled() {
    try {
        await ride_cancelled_consumer.subscribe({topic: "ride-cancelled"});

        await ride_cancelled_consumer.run({
            eachMessage: rideCancelledHandler
        })

    } catch (error) {
        throw new Error("Error in getting ride-cancelled consumer(captain): " + (error as Error).message);
    }
}

export default rideCancelled;