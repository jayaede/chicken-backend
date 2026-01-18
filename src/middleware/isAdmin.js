module.exports = (req, res, next) => {
  // Allow preflight requests to pass through without role checks
  if (req.method === "OPTIONS") return next();
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
