const axios = require("axios");

exports.sendOtpSms = async (phone, otp) => {
  try {
    // Ensure 10 digit Indian number
    phone = phone.replace(/\D/g, "").slice(-10);
    const response = await axios.get(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: "q",
          message: `Your OTP for Chicken Shop password reset is ${Number(otp)}. It is valid for 5 minutes.`,
          flash: 0,
          numbers: Number(phone),
        },
      }
    );

    console.log("FAST2SMS RESPONSE:", response.data);

    if (!response.data.return) {
      throw new Error(response.data.message || "OTP failed");
    }

    return true;
  } catch (err) {
    console.error("FAST2SMS ERROR:", err.response?.data || err.message);
    throw err;
  }
};