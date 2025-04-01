import kafka from "./kafkaClient.js"

const consumer = kafka.consumer({ groupId: "captain-group-service" });

async function consumerInit() {
    await consumer.connect();
}

async function getCaptainRequest() {
    try {
        await consumer.subscribe({ topic: "captain-notify", fromBeginning: true })
        await consumer.run({
            eachMessage: ({ message }) => {
                console.log(`message from ride-service: ${message.value}`);
            }
        })
    } catch (error) {
        console.log("error in getting captain request: ", error);
    }
}

export default { consumerInit, getCaptainRequest };