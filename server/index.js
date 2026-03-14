const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors());
app.use(express.json());

/* -------------------- MONGODB CONNECTION -------------------- */

mongoose.connect("mongodb://127.0.0.1:27017/phishing-simulator")

.then(() => {
  console.log("MongoDB Connected");
})

.catch((err) => {
  console.log("MongoDB Error:", err);
});

/* -------------------- MODELS -------------------- */

const SimulationEvent = require("./models/SimulationEvent");

/* -------------------- ROUTES -------------------- */

const campaignRoutes = require("./routes/campaigns");

app.use("/api/campaigns", campaignRoutes);

const analyticsRoutes = require("./routes/analytics");

app.use("/api/analytics", analyticsRoutes);

/* -------------------- TRACK EMAIL CLICK -------------------- */

app.get("/track/:token", async (req, res) => {

  const token = req.params.token;

  try {

    const event = await SimulationEvent.findOne({ token });

    if (event) {

      event.clicked = true;
      event.clickedAt = new Date();

      await event.save();

      console.log("Email clicked:", token);

    }

  } catch (error) {

    console.log("Tracking error:", error);

  }

  res.sendFile(path.join(__dirname, "public", "simulation.html"));

});

/* -------------------- TRACK CREDENTIAL ATTEMPT -------------------- */

app.post("/track/credentials", async (req, res) => {

  const { token } = req.body;

  try {

    const event = await SimulationEvent.findOne({ token });

    if (event) {

      event.credentialsEntered = true;
      event.credentialsAt = new Date();

      await event.save();

      console.log("Credential attempt recorded:", token);

    }

    res.json({ status: "recorded" });

  } catch (error) {

    console.log(error);

    res.status(500).json({ error: "Tracking failed" });

  }

});

/* -------------------- SERVER START -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Phishing Simulator Backend Running on port ${PORT}`);

});