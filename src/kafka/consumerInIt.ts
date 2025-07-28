import kafka from "./kafkaClient.js"

const get_captain_consumer = kafka.consumer({ groupId: "get-captain-group" });
const update_captain_earnings_consumer = kafka.consumer({ groupId: "update-captain-earnings" });
const ride_cancelled_consumer = kafka.consumer({ groupId: "ride-cancelled-group-captain" });
const captain_location_update_consumer = kafka.consumer({ groupId: "captain-location-update" });

async function consumerInit() {
    await Promise.all([
        get_captain_consumer.connect(),
        update_captain_earnings_consumer.connect(),
        ride_cancelled_consumer.connect(),
        captain_location_update_consumer.connect()
    ]);
}

export { consumerInit, get_captain_consumer, update_captain_earnings_consumer, ride_cancelled_consumer, captain_location_update_consumer };