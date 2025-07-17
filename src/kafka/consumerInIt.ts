import kafka from "./kafkaClient.js"

const getCaptainConsumer = kafka.consumer({ groupId: "get-captain-group" });
const update_captain_earnings = kafka.consumer({ groupId: "update-captain-earnings" });
const ride_cancelled_consumer = kafka.consumer({ groupId: "ride-cancelled-group" });
const captain_location_update = kafka.consumer({ groupId: "captain-location-update" });

async function consumerInit() {
    await Promise.all([
        getCaptainConsumer.connect(),
        update_captain_earnings.connect(),
        ride_cancelled_consumer.connect(),
        captain_location_update.connect()
    ]);
}

export { consumerInit, getCaptainConsumer, update_captain_earnings, ride_cancelled_consumer, captain_location_update };