const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require("axios");

router.post("/code", auth, async (req, res) => {
  const phone = req.user.phone;
  try {
    const { data } = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/generate-order-code`,
      { phone },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(data);
  } catch (err) {
    console.error("generate-order-code error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate order code" });
  }
});

module.exports = router;
