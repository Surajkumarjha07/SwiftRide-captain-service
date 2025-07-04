import { consumerInit } from "./consumerInIt.js";
import acceptRide from "./consumers/acceptRideConsumer.js";
import captainPayment from "./consumers/captainPaymentConsumer.js";
import getCaptainRequest from "./consumers/getCaptainConsumer.js";
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
        await acceptRide();
        await captainPayment();
        
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;