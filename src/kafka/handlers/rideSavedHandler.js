
async function rideSavedHandler({ message }) {
    const data = JSON.parse(message.value.toString());
    return data;
}

export default rideSavedHandler;