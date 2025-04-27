import { consumerInit } from "./consumerInIt.js";
import getCaptainRequest from "./consumers/getCaptainConsumer.js";
import acceptRideHandler from "./handlers/acceptRideHandler.js";
import kafkaInit from "./kafkaAdmin.js";
import producerInit from "./producerInIt.js";

const startKafka = async () => {
    try {
        await kafkaInit();

        console.log("Consumer initialization...");
        await consumerInit();
        console.log("Consumer initialized...");

        console.log("Producer initialization...");
        await producerInit();
        console.log("Producer initializated");

        await getCaptainRequest();
        await acceptRideHandler();
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;