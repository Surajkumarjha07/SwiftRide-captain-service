import kafka from "./kafkaClient.js"

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const acceptRideConsumer = kafka.consumer({ groupId: "accept-ride-group" });
const rideSavedConsumer = kafka.consumer({groupId: "ride-saved-group"});

async function consumerInit() {
    await Promise.all([
        getCaptainConsumer.connect(),
        acceptRideConsumer.connect(),
        rideSavedConsumer.connect()
    ])
}

export { consumerInit, getCaptainConsumer, acceptRideConsumer, rideSavedConsumer };