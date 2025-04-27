import kafka from "./kafkaClient.js"

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const acceptRideConsumer = kafka.consumer({ groupId: "accept-ride-group" });

async function consumerInit() {
    await Promise.all([
        getCaptainConsumer.connect(),
        acceptRideConsumer.connect()
    ])
}

export { consumerInit, getCaptainConsumer, acceptRideConsumer };