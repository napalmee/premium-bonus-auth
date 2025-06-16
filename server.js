// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: false,
}));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/register", registerRoutes);

app.get("/", (req, res) => res.send("Premium Bonus API ready."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
