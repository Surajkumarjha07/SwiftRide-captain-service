import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})

async function producerInit() {
    await producer.connect();
}

async function sendProducerMessage(topic, data) {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }]
        })
    } catch (error) {
        console.log(`error in sending ${topic}: ${error}`);
    }
}

export default { producerInit, sendProducerMessage };