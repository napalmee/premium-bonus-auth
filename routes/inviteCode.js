const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { identificator } = req.body;

  if (!identificator) {
    return res.status(400).json({ error: "Missing identificator" });
  }

  try {
    const { data } = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer-invite-code`,
      { identificator },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );
    res.json(data);
  } catch (err) {
    console.error("invite-code error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch referral code" });
  }
});

module.exports = router;

