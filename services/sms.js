// services/sms.js
const axios = require("axios");

exports.send = async (phone, msg) => {
  const params = {
    api_id: process.env.SMS_API_ID,
    to: phone,
    msg,
    json: 1,
  };

  try {
    const res = await axios.get(process.env.SMS_API_URL, { params });
    const result = res.data;
    const status = result.sms?.[phone]?.status;

    return result.status === "OK" && status === "OK";
  } catch (e) {
    console.error("SMS error:", e.response?.data || e.message);
    return false;
  }
};
