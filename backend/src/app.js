const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");
const webhookRoutes = require("./routes/webhook.routes");

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/webhooks", webhookRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "App is Running",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});