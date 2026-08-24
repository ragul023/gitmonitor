const express = require("express");
const cors = require("cors");

const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/webhooks", webhookRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "App is Running",
    });
});

module.exports = app;