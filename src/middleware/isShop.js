module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  if (req.user.role !== "SHOP") {
    return res.status(403).json({ message: "Shop access only" });
  }
  next();
};