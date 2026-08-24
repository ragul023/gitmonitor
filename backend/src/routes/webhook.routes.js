const express = require("express");

const {
    processWebhook,
} = require("../controllers/webhook.controller");

const router = express.Router();

router.post("/github", processWebhook);

module.exports = router;