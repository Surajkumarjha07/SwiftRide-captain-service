import { consumerInit } from "./consumerInIt.js";
import captainLocationUpdate from "./consumers/locationUpdate.consumer.js";
import captainPayment from "./consumers/captainPayment.consumer.js";
import getCaptainRequest from "./consumers/getCaptain.consumer.js";
import rideCancelled from "./consumers/rideCancelled.consumer.js";
import kafkaInit from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

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
        await captainPayment();
        await captainLocationUpdate();
        await rideCancelled();
        
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;