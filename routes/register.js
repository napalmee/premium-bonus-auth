const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const smsCodes = new Map(); // временное хранилище кодов

// 📲 Отправка SMS-кода (заглушка)
router.post("/send", async (req, res) => {
  const { phone } = req.body;

  if (!/^7\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Некорректный номер" });
  }

  const code = "1234"; // заглушка
  smsCodes.set(phone, code);
  console.log(`📲 MOCK SMS код для ${phone}: ${code}`);

  setTimeout(() => smsCodes.delete(phone), 5 * 60 * 1000); // 5 минут

  res.json({ success: true });
});

// ✅ Проверка кода
router.post("/verify", async (req, res) => {
  const { phone, code } = req.body;

  if (smsCodes.get(phone) !== code) {
    return res.status(400).json({ error: "Неверный код" });
  }

  res.json({ success: true });
});

// 🧾 Регистрация и выдача JWT
router.post("/finish", async (req, res) => {
  const {
    phone,
    name,
    surname,
    email,
    birth
