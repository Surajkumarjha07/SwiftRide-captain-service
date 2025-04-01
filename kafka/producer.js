import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})

async function producerInit() {
    await producer.connect();
}

async function SendRideAccepted(data) {
    try {
        await producer.send({
            topic: "ride-request",
            messages: [{ value: JSON.stringify(data) }]
        })
    } catch (error) {
        console.log("error in sending ride-request: ", error);
    }
}

export default { producerInit, SendRideAccepted };