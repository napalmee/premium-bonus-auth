// routes/register.js
const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("Register route is working.");
});

module.exports = router;
