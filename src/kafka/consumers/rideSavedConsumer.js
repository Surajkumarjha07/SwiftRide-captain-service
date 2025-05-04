import { rideSavedConsumer } from "../consumerInIt.js";
import rideSavedHandler from "../handlers/rideSavedHandler.js";

async function rideSaved() {
    await rideSavedConsumer.subscribe({topic: "ride-saved", fromBeginning: true});
    await rideSavedConsumer.run({
        eachMessage: rideSavedHandler
    })
}

export default rideSaved;