const eventHandler = require("../handlers/eventHandler");
const pushHandler = require("../handlers/push.Handler")

const eventHandlers = {
    push:pushHandler,
    pull_request: eventHandler.pullHandler,
    issues: eventHandler.issuesHandler,
};

const dispatch = (event, body , deliveryId) => {
    if (!body) {
        return null;
    }

    const handler = eventHandlers[event];

    if (!handler) {
        console.log(`No handler found for event: ${event}`);
        return null;
    }

    console.log(`Dispatching ${event} event`);

    return handler(body,deliveryId);
};

module.exports = {
    dispatch,
};