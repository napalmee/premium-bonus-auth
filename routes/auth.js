// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("../services/jwt");
const sms = require("../services/sms");
const axios = require("axios");

const SMS_CODES = new Map(); // { phone => code } (in-memory for now)

// Проверка — зарегистрирован ли пользователь
router.post("/check", async (req, res) => {
  const { phone } = req.body;
  console.log("TOKEN:", process.env.PREMIUM_BONUS_TOKEN);

  if (!phone) return res.status(400).json({ error: "Phone is required" });

  try {
    const { data } = await axios.post(`${process.env.PREMIUM_BONUS_API}/buyer-info`, {
      phone,
    }, {
      headers: {
        Authorization: process.env.PREMIUM_BONUS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    console.log("buyer-info response:", data);

    res.json({
      isRegistered: data?.is_registered ?? false,
    });
  } catch (err) {
    console.error("buyer-info error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to check registration" });
  }
});

// Отправка кода через SMS.ru
router.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const message = `Код для входа: ${code}`;

  try {
    const success = await sms.send(phone, message);
    if (!success) throw new Error("SMS send failed");

    SMS_CODES.set(phone, code);
    setTimeout(() => SMS_CODES.delete(phone), 5 * 60 * 1000); // expire in 5 min

    res.json({ success: true });
  } catch (err) {
    console.error("SMS error:", err.message);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// Проверка кода, выдача JWT
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

  const valid = SMS_CODES.get(phone);
  if (valid !== code) {
    return res.status(401).json({ error: "Invalid code" });
  }

  SMS_CODES.delete(phone);

  const token = jwt.sign({ phone });

  res.json({ token });
});

module.exports = router;
