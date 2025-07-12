import kafka from "./kafkaClient.js"

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const acceptRideConsumer = kafka.consumer({ groupId: "accept-ride-group" });
const rideSavedConsumer = kafka.consumer({groupId: "ride-saved-group"});
const captain_payment_consumer = kafka.consumer({groupId: "captain-payment"});
const ride_cancelled_consumer = kafka.consumer({groupId: "ride-cancelled-group"});

async function consumerInit() {
    await Promise.all([
        getCaptainConsumer.connect(),
        acceptRideConsumer.connect(),
        rideSavedConsumer.connect(),
        captain_payment_consumer.connect(),
        ride_cancelled_consumer.connect()
    ]);
}

export { consumerInit, getCaptainConsumer, acceptRideConsumer, rideSavedConsumer, captain_payment_consumer, ride_cancelled_consumer };