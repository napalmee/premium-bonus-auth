const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { identificator } = req.body;

  try {
    const response = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer-info`,
      { identificator },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    // 🔥 Вот это ВАЖНО:
    res.json(response.data); // без лишней обёртки
  } catch (err) {
    console.error("buyer-info ошибка:", err?.response?.data || err.message);
    res.status(500).json({ error: "Ошибка запроса buyer-info" });
  }
});

module.exports = router;
