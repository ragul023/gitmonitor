const express = require("express");
const webhook = require("../services/webhook.services")
const router = express.Router();


router.post("/github",webhook.createwebhook)

module.exports = router;