const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const phone = req.user.phone;

  try {
    const { data } = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer-info-messages`,
      {
        identificator: phone,
        limit: 10,
        offset: 0,
        type: ["sms", "push", "email"],
        status: [200, 300]
      },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json",
        }
      }
    );

    res.json(data);
  } catch (err) {
    console.error("buyer-info-messages error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Ошибка получения сообщений" });
  }
});

module.exports = router;
