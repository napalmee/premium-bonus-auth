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

    // 💡 Отдаём весь JSON как есть
    res.json(response.data);
  } catch (err) {
    console.error("Ошибка buyer-info:", err.response?.data || err.message);
    res.status(500).json({ error: "Ошибка получения информации о покупателе" });
  }
});

module.exports = router;
