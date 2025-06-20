const express = require("express");
const router = express.Router();
const jwt = require("../services/jwt");
const axios = require("axios");

const SMS_CODES = new Map(); // { phone => code } (in-memory для тестов)

// Проверка — зарегистрирован ли пользователь
router.post("/check", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone is required" });

  try {
    const { data } = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer-info`,
      { phone },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      isRegistered: data?.is_registered ?? false,
    });
  } catch (err) {
    console.error("buyer-info error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to check registration" });
  }
});

// Заглушка отправки SMS — безопасно для разработки
router.post("/send-code", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const code = "1234"; // 🔒 фиксированный код-заглушка
  console.log(`📲 MOCK SMS-код для ${phone}: ${code}`);

  SMS_CODES.set(phone, code);
  setTimeout(() => SMS_CODES.delete(phone), 5 * 60 * 1000); // expire in 5 мин

  res.json({ success: true });
});

// Проверка кода и выдача JWT
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

  const valid = SMS_CODES.get(phone);
  if (valid !== code) {
    return res.status(401).json({ error: "Invalid code" });
  }

  SMS_CODES.delete(phone);

  // Выдача JWT (на 30 дней)
  const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({ token }); // 🔥 фронт ожидает именно это
});

module.exports = router;
