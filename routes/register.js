// routes/register.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// 1. Отправка SMS-кода через Premium Bonus
router.post("/send", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone is required" });

  try {
    const { data } = await axios.post(`${process.env.PREMIUM_BONUS_API}/send-register-code`, {
      phone,
    }, {
      headers: {
        Authorization: process.env.PREMIUM_BONUS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("send-register-code error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send code" });
  }
});

// 2. Подтверждение кода
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code are required" });

  try {
    const { data } = await axios.post(`${process.env.PREMIUM_BONUS_API}/verify-confirmation-code`, {
      phone,
      code,
    }, {
      headers: {
        Authorization: process.env.PREMIUM_BONUS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("verify-confirmation-code error:", err.response?.data || err.message);
    res.status(500).json({ error: "Code verification failed" });
  }
});

// 3. Регистрация нового пользователя
router.post("/finish", async (req, res) => {
  const {
    phone, name, surname, email, birth_date, gender
  } = req.body;

  if (!phone || !name || !email || !gender || !birth_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data } = await axios.post(`${process.env.PREMIUM_BONUS_API}/buyer-register`, {
      phone,
      name,
      surname,
      email,
      birth_date,
      gender,
    }, {
      headers: {
        Authorization: process.env.PREMIUM_BONUS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("buyer-register error:", err.response?.data || err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
