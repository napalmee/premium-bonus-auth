// middleware/auth.js
const jwt = require("../services/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token);
    req.user = payload; // { phone: ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
