// services/jwt.js
const jwt = require("jsonwebtoken");

exports.sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
