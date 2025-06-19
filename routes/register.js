const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const smsCodes = new Map(); // Временное хранилище кода подтверждения

// 📲 1. Отправка SMS-кода (заглушка)
router.post("/send", async (req, res) => {
  const { phone } = req.body;
  if (!/^7\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Некорректный номер" });
  }

  const code = "1234"; // В проде — сгенерировать случайный и отправить через SMS API
  smsCodes.set(phone, code);
  console.log(`Отправлен код ${code} на ${phone}`);
  res.json({ success: true });
});

// ✅ 2. Проверка кода
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;
  if (smsCodes.get(phone) !== code) {
    return res.status(400).json({ error: "Неверный код" });
  }
  res.json({ success: true });
});

// 🧾 3. Регистрация + JWT
router.post("/finish", async (req, res) => {
  const {
    phone,
    name,
    surname,
    email,
    birth_date,
    gender,
    referral_code
  } = req.body;

  try {
    const regRes = await axios.post(
      `${process.env.PREMIUM_BONUS_API}/buyer-register`,
      {
        phone,
        name,
        surname,
        email,
        birth_date,
        gender,
        referral_code,
        phone_checked: true
      },
      {
        headers: {
          Authorization: process.env.PREMIUM_BONUS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    const user = regRes.data;

    const token = jwt.sign(
      {
        phone: user.phone,
        external_id: user.external_id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Ошибка регистрации:", err.response?.data || err.message);
    res.status(500).json({ error: "Не удалось зарегистрировать" });
  }
});

module.exports = router;

  }
});

module.exports = router;
