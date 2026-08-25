const eventDispatcher = require("../services/eventdispatcher.service");

const processWebhook = (req, res) => {
    // console.log("GitHub webhook received");

    const event = req.headers["x-github-event"];
    const deliveryId = req.headers["x-github-delivery"];
    const body = req.body;

    console.log("Event:", event);
    console.log("Delivery ID:", deliveryId);

    if (!event) {
        return res.status(400).json({
            message: "GitHub event header is missing",
        });
    }

    if (!body) {
        return res.status(400).json({
            message: "Webhook body is missing",
        });
    }

    eventDispatcher.dispatch(event, body , deliveryId);

    return res.status(200).json({
        message: "Webhook received",
    });
};

module.exports = {
    processWebhook,
};