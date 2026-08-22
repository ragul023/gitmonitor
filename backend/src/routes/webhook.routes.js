const express = require("express");

const router = express.Router();

router.post("/github", (req, res) => {
    console.log("GitHub webhook received");

    console.log("Event:", req.headers["x-github-event"]);
    console.log("Delivery ID:", req.headers["x-github-delivery"]);

    console.log("Payload:", req.body);

    res.status(200).json({
        message: "Webhook received",
    });
});

module.exports = router;