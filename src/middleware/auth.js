const jwt = require("jsonwebtoken");
const User = require("../modules/auth/user.model");
module.exports = (req, res, next) => {
  // Always validate req/res existence
  if (!req || !res) {
    return;
  }
  
  // Allow preflight requests to pass through without auth checks
  if (req.method === "OPTIONS") return next();
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = User.findById(decoded.id).populate("shop");

    // if (!user) {
    //   return res.status(401).json({ message: "User not found" });
    // }

    // Attach user info
    req.user = {
      id: decoded.id,
      role: decoded.role,
      shopId: decoded.shopId || null
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
