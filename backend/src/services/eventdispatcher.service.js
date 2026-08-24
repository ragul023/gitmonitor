const eventHandler = require("../handlers/eventHandler");

const eventHandlers = {
    push: eventHandler.pushHandler,
    pull_request: eventHandler.pullHandler,
    issues: eventHandler.issuesHandler,
};

const dispatch = (event, body) => {
    if (!body) {
        return null;
    }

    const handler = eventHandlers[event];

    if (!handler) {
        console.log(`No handler found for event: ${event}`);
        return null;
    }

    console.log(`Dispatching ${event} event`);

    return handler(body);
};

module.exports = {
    dispatch,
};