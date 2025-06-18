const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const phone = req.user.phone;

  try {
    const { data } = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer/purchase-list`,
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
    console.error("purchase-list error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Ошибка получения покупок" });
  }
});

module.exports = router;
