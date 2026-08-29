const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const webhookRoutes = require("./routes/webhook.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/webhooks", webhookRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "App is Running",
  });
});

module.exports = app;