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

const authMiddleware = require("./middleware/auth");

app.get("/me", authMiddleware, async (req, res) => {
  const axios = require("axios");

  try {
    const { data } = await axios.post(`${process.env.PREMIUM_BONUS_API}/buyer-info-detail`, {
      phone: req.user.phone
    }, {
      headers: {
        Authorization: process.env.PREMIUM_BONUS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("buyer-info-detail error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});
