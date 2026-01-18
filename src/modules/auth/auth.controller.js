const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ username });

    console.log("USER FROM DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password (CASE SENSITIVE)
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Create JWT
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
