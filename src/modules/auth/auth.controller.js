const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../../utils/otp");
const { sendOtpSms } = require("../../utils/sendSms");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = await User.findOne({ username });
    console.log("USER FROM DB:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        shopId: user.shopId || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // 5️⃣ Respond
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        shopId: user.shopId
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtpAndReset = async (req, res) => {
  const { username, otp, newPassword } = req.body;

  const user = await User.findOne({
    username,
    role: "SHOP",
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  const isMatch = await bcrypt.compare(otp, user.otpHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otpHash = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

exports.sendOtp = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username, role: "SHOP" });
  if (!user) {
    return res.status(404).json({ message: "Shop user not found" });
  }
  if (user.otpExpires && user.otpExpires > Date.now() - 60 * 1000) {
    return res.status(429).json({ message: "Wait before requesting OTP again" });
  }
  const otp = generateOTP();
  
  await sendOtpSms(user.phone, otp);

  res.json({ success: true, message: "OTP sent to registered mobile number" });
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpires = Date.now() + 5 * 60 * 1000;

  await user.save();

};
