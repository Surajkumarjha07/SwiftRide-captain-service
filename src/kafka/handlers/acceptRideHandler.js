
async function acceptRideHandler({ message } = {}) {
    // later we will emit sockets
    if (message) {
        console.log("accept-ride: ", message.value.toString());
    }
}

export default acceptRideHandler;